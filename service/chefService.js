import BaseService from './baseService.js'
import {AutoWritedChefModel} from '../common/AutoWrite.js'
import db from '../config/db.js'
import userService from './userService'
import baseResult from "../model/baseResult"
import user from '../model/user'
import language from '../model/language'
import cuisineType from '../model/cuisineType'
import experience from '../model/chefExperience'
import cuisineTypeService from './cuisineTypeService'
import chefCuisineSerivce from './chefCuisineSerivce'
import chefExpService from './chefExpService'
import utils from "../common/utils";
@AutoWritedChefModel
class ChefService extends BaseService{
    constructor(){
        super(ChefService.model)
    }
    getChefList(attr) {
        return ChefService.model.getChefList(attr)
    }

    processCreateChef(user) {
        let chef = {};
        chef = user;
        return db.transaction(t => {
            return userService.getModel().max('user_id',{transaction: t}).then(maxId => {
                console.log("in request user_id : ", maxId+1);
                user.user_id = maxId+1;
                user.active_ind = 'A'; // 初始为0，表示不激活
                // getModel是获取实例model.调用的是Sequelize 自身提供的方法操作数据库的方法
                return userService.getModel().create(user, {transaction: t}).then(createdUser => {
                    //add chef
                    chef.user_id = createdUser.user_id;
                    // throw new Error("error occour!");
                    return this.getModel().max('chef_id',{transaction: t}).then(maxId => {
                        chef.chef_id = maxId+1;
                      return  this.getModel().create(chef,{transaction: t}).then(chef => {
                            return chef;
                        })
                    });

                })
            }).catch(err => {
                throw  err;
            })
        })

    }
    updateChef(attr) {
        if (!attr.first_name || !attr.last_name || !attr.short_desc ) {
            let e = new Error();
            e.code = baseResult.CHEF_MANDATORY_FIELD_EXCEPTION.code;
            e.msg = baseResult.CHEF_MANDATORY_FIELD_EXCEPTION.msg;
            throw e;
        }

        return db.transaction(t => {

            return this.getModel().findOne({where:{chef_id: attr.chef_id}, transaction: t}).then(existOne => {
                console.log("existOne: ", existOne);

                if (existOne) {
                    return userService.getModel().update(attr, {where:{user_id: existOne.user_id}, transaction: t}).then(user => {

                        return this.getModel().update(attr, {where:{chef_id: existOne.chef_id}, transaction: t}).then(chef => {
                            console.log("chef: ", chef);
                            let promiseArr =  [] ;
                            let experience_list = attr.experience_list;
                            let cuisine_type = attr.cuisine_type;

                            if (Array.isArray(experience_list) && experience_list.length > 0) {
                              experience_list.forEach((exp,index) => {
                                    console.log("exp=>",exp);
                                     promiseArr.push(chefExpService.updateChefReferToExperience(existOne,exp,t));
                                })
                            }

                            if (Array.isArray(cuisine_type) && cuisine_type.length > 0) {
                                cuisine_type.forEach(type => {
                                    promiseArr.push(chefCuisineSerivce.updateChefReferToCuisine(type,existOne.chef_id,t))
                                })
                            }
                            return Promise.all(promiseArr);

                        });
                    });

                } else {
                    throw baseResult.CHEF_USER_ID_NOT_EXIST;
                }

            }).catch(err => {
                throw  err;
            })
        })
    }

    async checkChefIsExist(chefId) {
        if (!chefId) {
            throw baseResult.CHEF_ID_NOT_EXIST;
        }
       let chef =  await this.getChefByChefId(chefId);
       if (!chef) {
           throw (baseResult.CHEF_USER_ID_NOT_EXIST);
       }
    }
    getChefByChefId (chefId) {
        return this.getModel().findOne({where:{chef_id:chefId}})

    }
    updateChefQualification(attr) {
        return this.baseUpdate(attr,{chef_id:attr.chef_id})
    }

    findChefByPopularity() {
   /*     var sql = "select * from chef left join "

        return db.query*/
   return "";
    }

    getMenuByChefId(attr) {
        var chefDetail = {};
        var sql = "select detail.* from chef_menu cm " +
            "left join menu_details detail on detail.menu_id =  cm.menu_id "
            +" where cm.chef_id= :chef_id";
        return  db.query(sql,{replacements:attr,type:db.QueryTypes.SELECT});
    }
     getChefDetailByChefId(chefId) {
           return  db.transaction(t=> {
              return this.getModel().findOne({
                  include:[
                      {model:user['model']}
                  ],
                  where:{chef_id:chefId},
                  transaction:t
              }).then(chefUser => {
                  let tmp = JSON.parse(JSON.stringify(chefUser))
                  let chefDetail = tmp.t_user;
                  chefDetail.chef_id = tmp.chef_id;
                  chefDetail.short_description = tmp.short_desc;
                  chefDetail.detail_description = tmp.detail_desc;
                  return this.getLangCodeList(chefId,t).then(langCodeList =>{
                      chefDetail.language_code_list = langCodeList;
                      return this.getCuisineTypeList(chefId,t).then(cuisineType =>{
                          chefDetail.cuisine_type = cuisineType;
                          return this.getExperienceList(chefId,t).then(expList =>{
                              chefDetail.experience_list = expList;
                              return chefDetail;
                          })
                      })
                  })
              });
          })

    }
    getChefUserByChefId(chefId,trans) {
        let sql = ` select chef.chef_id,chef.short_desc as 'short_description' ,chef.detail_desc as 'detail_description' ,user.* from t_chef chef left join t_user user on chef.user_id = user.user_id
where chef.chef_id = :chef_id`;
        return db.query(sql,{replacements:{chef_id:chefId},type:db.QueryTypes.SELECT,transaction:trans});
    }

    getExperienceList(chefId,trans) {
       var chefUserSql = "SELECT ce.start_date,ce.end_date,ce.exp_desc as 'experience_description'  FROM t_chef_experience ce  WHERE chef_id= :chef_id";
        return   db.query(chefUserSql,{replacements:{chef_id:chefId},type:db.QueryTypes.SELECT,transaction:trans});
    }
    getCuisineTypeList(chefId,trans) {
        var cuisineSql =   `SELECT ct.cuisine_type_id FROM t_cuisine_type ct LEFT JOIN t_chef_cuisine cc  ON ct.cuisine_type_id = cc.cuisine_type_id
WHERE cc.chef_id = :chef_id`;
        return  db.query(cuisineSql,{replacements:{chef_id:chefId},type:db.QueryTypes.SELECT ,transaction:trans});
    }
    getLangCodeList(chefId,trans) {
        var langCodeSql = `SELECT lang_code FROM t_chef_language WHERE chef_id =:chef_id`;
        return  db.query(langCodeSql,{replacements:{chef_id:chefId},type:db.QueryTypes.SELECT,transaction:trans});
    }
}
module.exports = new ChefService()