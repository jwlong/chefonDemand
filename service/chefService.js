import BaseService from './baseService.js'
import {AutoWritedChefModel} from '../common/AutoWrite.js'
import db from '../config/db.js'
import userService from './userService'
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
                    chef.active_ind = 'A';
                    chef.create_by = createdUser.create_by;
                    chef.update_by = createdUser.update_by;
                    // throw new Error("error occour!");
                    return this.getModel().max('chef_id',{transaction: t}).then(maxId => {
                        chef.chef_id = maxId+1;
                      return  this.getModel().create(chef,{transaction: t}).then(chef => {
                            console.log("chef", chef);
                            return chef;
                        })
                    });

                })
            }).catch(err => {
                throw  err;
            })
        })

    }

    findChefByPopularity() {
   /*     var sql = "select * from chef left join "

        return db.query*/
   return "";
    }

    getMenuByChefId(attr) {
        var sql = "select detail.* from chef_menu cm " +
            "left join menu_details detail on detail.menu_id =  cm.menu_id "
            +" where cm.chef_id= :chef_id";
        return  db.query(sql,{replacements:attr,type:db.QueryTypes.SELECT});
    }
    getChefDetailByChefId(attr) {
       // var sql = "select ";
    }

}
module.exports = new ChefService()