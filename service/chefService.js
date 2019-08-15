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

     processCreateChef(user){
        let chef = {};
            return  db.transaction( t=> {
                return userService.getNextId('user_id').then(nextId => {
                    console.log("in request user_id : ", nextId);
                    user.user_id = nextId;
                    user.active_ind = 'A'; // 初始为0，表示不激活
                    user.ipv4_address = user.IPv4_address;
                    user.sms_notify_ind = user.SMS_notify_ind;
                    return userService.baseCreate(user).then(createdUser => {
                        //add chef
                        chef.user_id = createdUser.user_id;
                        // attr.short_desc = attr.short_description;
                        //attr.detail_desc = attr.detail_description;
                        chef.active_ind = 'A';
                        chef.create_by = createdUser.create_by;
                        chef.update_by = createdUser.update_by;
                        return this.getNextId('chef_id').then(nextId => {
                            chef.chef_id = nextId;
                            console.log("===========>", chef);
                            return this.baseCreate(chef);
                        })
                    });
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