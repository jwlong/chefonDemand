import BaseService from './baseService.js'
import {AutoWritedChefModel} from '../common/AutoWrite.js'
import db from '../config/db.js'
import userService from './userService'
import baseResult from "../model/baseResult"
import user from '../model/user'
import chefCuisineSerivce from './chefCuisineSerivce'
import chefLanguageService from  './chefLanguageService'
/*import chefMenuService from './chefMenuService'*/
import chefExpService from './chefExpService'
import chefLocationService from './chefLocationService'
import activeIndStatus from "../model/activeIndStatus";
import Sequelize from 'sequelize'
const Op = Sequelize.Op
import moment from 'moment'

@AutoWritedChefModel
class ChefService extends BaseService{
    constructor(){
        super(ChefService.model)
    }
    getChefList(attr) {
        return this.getModel().findAll(attr);
    }

    isChefWithUserId(userId) {
      return  this.getChefByUserId(userId).then(result => {
          return result? true:false;
      })
    }
    isOnlyCanAccessPublic(userId) {
        if (!userId) {
            return true
        }
        return this.getChefByUserId(userId).then(result => {
            return !result;
        })
    }

    getChefByUserId(userId) {
        console.log("get active status chef by userId:",userId);
        return this.getModel().findOne({where:{user_id:userId,active_ind:activeIndStatus.ACTIVE}}).then(existOne => {
            if (existOne) {
                return existOne;
            }else {
                return null;
            }
        })
    }
    getChefIgnoreStatusByUserId(userId) {
        console.log("get chef (ignore status) by userId:",userId);
        return this.getModel().findOne({where:{user_id:userId}}).then(existOne => {
            if (existOne) {
                return existOne;
            }else {
                return null;
            }
        })
    }
    processCreateChef(user) {
        let chef = {};
        chef = user;
        return db.transaction(t => {
            return userService.nextId('user_id',{transaction: t}).then(nextId => {
                user.user_id = nextId;
                // getModel是获取实例model.调用的是Sequelize 自身提供的方法操作数据库的方法
                return userService.baseCreate(user, {transaction: t}).then(createdUser => {
                    //add chef
                    chef.user_id = createdUser.user_id;
                    // throw new Error("error occour!");
                    return this.nextId('chef_id',{transaction: t}).then(nextId => {
                        chef.chef_id = nextId;
                      return  this.baseCreate(chef,{transaction: t}).then(chef => {
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
                    return userService.baseUpdate(attr, {where:{user_id: attr.user_id}, transaction: t}).then(user => {

                        return this.baseUpdate(attr, {where:{chef_id: attr.chef_id}, transaction: t}).then(updateCnt => {
                            console.log("update chef count : ", updateCnt);
                            let promiseArr =  [] ;
                            let experience_list = attr.experience_list;
                            let cuisine_type = attr.cuisine_type;

                            if (Array.isArray(experience_list) && experience_list.length > 0) {
                              experience_list.forEach((exp,index) => {
                                    console.log("exp=>",exp);
                                     promiseArr.push(chefExpService.updateChefReferToExperience(attr.chef_id,exp,t,index));
                                })
                            }

                            if (Array.isArray(cuisine_type) && cuisine_type.length > 0) {
                                let cuisineTypeIds = [];
                                cuisine_type.forEach(type => {
                                    cuisineTypeIds.push(type.cuisine_type_id);
                                    promiseArr.push(chefCuisineSerivce.updateChefReferToCuisine(attr.chef_id,type,t))
                                })
                                let inactivePromise =  chefCuisineSerivce.baseUpdate({active_ind:activeIndStatus.INACTIVE},{where:{chef_id:attr.chef_id,active_ind:activeIndStatus.ACTIVE,cuisine_type_id:{[Op.notIn]:cuisineTypeIds}},transaction:t})
                                promiseArr.push(inactivePromise);
                            }
                            return Promise.all(promiseArr);

                        });
                    });
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
    getChefByChefId (chefId,trans) {
        return this.getModel().findOne({where:{chef_id:chefId,active_ind:activeIndStatus.ACTIVE},transaction:trans})
    }
    getChefIngoreStatusByChefId(chefId,trans) {
        return this.getOne({where:{chef_id:chefId},transaction:trans})
    }
    updateChefQualification(attr) {
        return this.baseUpdate(attr,{where:{chef_id:attr.chef_id}})
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
                 /* let tmp = JSON.parse(JSON.stringify(chefUser))
                  let chefDetail = tmp.t_user;
                  chefDetail.chef_id = tmp.chef_id;
                  chefDetail.short_description = tmp.short_desc;
                  chefDetail.detail_description = tmp.detail_desc;*/
                  let chefDetail = {};
                  chefDetail.chefUser = chefUser;
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
where chef.chef_id = :chef_id and chef.active_id = 'A'`;
        return db.query(sql,{replacements:{chef_id:chefId},type:db.QueryTypes.SELECT,transaction:trans});
    }

    getExperienceList(chefId,trans) {
       var chefUserSql = "SELECT ce.start_date,ce.end_date,ce.exp_desc as 'experience_description'  FROM t_chef_experience ce  WHERE chef_id= :chef_id and ce.active_ind = 'A' ";
        return   db.query(chefUserSql,{replacements:{chef_id:chefId},type:db.QueryTypes.SELECT,transaction:trans});
    }
    getCuisineTypeList(chefId,trans) {
        var cuisineSql =   `SELECT ct.cuisine_type_id FROM t_cuisine_type ct LEFT JOIN t_chef_cuisine cc  ON ct.cuisine_type_id = cc.cuisine_type_id
WHERE cc.chef_id = :chef_id and ct.active_ind = 'A' `;
        return  db.query(cuisineSql,{replacements:{chef_id:chefId},type:db.QueryTypes.SELECT ,transaction:trans});
    }
    getLangCodeList(chefId,trans) {
        var langCodeSql = `SELECT lang_code FROM t_chef_language WHERE chef_id =:chef_id and active_ind ='A' `;
        return  db.query(langCodeSql,{replacements:{chef_id:chefId},type:db.QueryTypes.SELECT,transaction:trans});
    }

    preparedMenuQueryCriteria(user_id,menu_id) {
        let criteria = {menu_id:menu_id,active_ind:activeIndStatus.ACTIVE};
        if (!user_id) {
            criteria.public_ind = 1;
            return new Promise(resolve => resolve(criteria));
        }

       return this.getChefByUserId(user_id).then(result => {
           console.log("result=>",result);
           // 当前用户不是chef，只能访问public_ind 为1的内容
            if (!result) {
                criteria.public_ind = 1;
            }else {
                criteria.chef_id = result.chef_id;
            }
            return criteria;
        })

    }
    covertQueryParam(query) {
        //convert param
        // page index start
        if (query.page_no === 0 || query.page_no === 1) {
            query.startIndex = 0
        }else {
            query.startIndex  = (query.page_no*query.pageSize -1);
        }
        query.langCodes =[],query.cuisineTypeIds = [],query.districtCodes = [];
        if (query.language_list) {
            query.language_list.forEach(code => {
                query.langCodes.push(code.lang_code);
            })
        }
        if (query.cuisine_type_list) {
            query.cuisine_type_list.forEach(typeId => {
                query.cuisineTypeIds.push(typeId.cuisine_type_id);
            })
        }
        if (query.district_code_list)  {
            query.district_code_list.forEach(districtCode => {
                query.districtCodes.push(districtCode.district_code);
            })
        }
    }

    checkFilters(query) {
        if (!query.page_no || isNaN(query.page_no)) {
            throw baseResult.PAGE_NUMBER_INVALID;
        }
        if (query.start_date) {
            //对比 day级别的
            if(moment(query.start_date).isBefore(moment(),'day')) {
                throw baseResult.MENU_START_DATE_ERROR;
            }
            if (query.end_date) {
                if (moment(query.end_date).isBefore(query.start_date)) {
                    throw baseResult.MENU_END_DATE_MUST_AFTER_START_DATE;
                }
            }
        }
    }

    checkParam(query) {
        console.log("check Param=======>",query)
        let promiseArr = [];
        query.cuisineTypeIds.forEach(typeId => {
           let typePrm =  chefCuisineSerivce.countByTypeId(typeId).then(cnt => {
                if (cnt == 0 || !cnt) {
                    throw baseResult.CHEF_ONE_OF_CUSITYPE_INVALID;
                }
            })
            promiseArr.push(typePrm);
        })

        query.langCodes.forEach(langCode => {
          let langPrm =  chefLanguageService.countChefLangByLangCode(langCode).then(cnt => {
                if (!cnt || cnt == 0) {
                    throw baseResult.CHEF_ONE_OF_LANG_INVALID;
                }
            })
            promiseArr.push(langPrm);
        })
        query.districtCodes.forEach(districtCode => {
           let disPrm =  chefLocationService.countByDistrict(districtCode).then(cnt => {
                if (!cnt || cnt == 0) {
                    throw baseResult.CHEF_ONE_OF_DISTRICT_INVALID;
                }
            });
           promiseArr.push(disPrm);
        })
        return Promise.all(promiseArr)
    }

    getCityList(menu,districtCodes) {
        let sql = `select city.city_name,city.city_code from t_city city
                  left join t_district t on city.city_code = t.city_code and t.active_ind = 'A'
                  left join t_chef_service_location t2 on t.district_code = t2.district_code and t2.active_ind = 'A'
                  left join t_chef tc on t2.chef_id = tc.chef_id and tc.active_ind = 'A'
                where tc.chef_id = :chef_id and city.active_ind = 'A' and t2.district_code in (:districtCodes) `;
        return db.query(sql,{replacements:{chef_id:menu.chef_id,districtCodes:districtCodes},type:db.QueryTypes.SELECT}).then(resp => {
                menu.city_code_list = resp;
                console.log("menu =========>",menu)
                return menu;
        });

    }
}
//module.exports = new ChefService()
export default new ChefService();