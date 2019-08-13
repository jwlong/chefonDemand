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
    checkBeforeCreate(attr) {
        var sql = "select count(u.user_id) cnt from  t_user u  where u.user_name = :user_name";
       return db.query(sql,{replacements:{user_name:attr.user_name},type:db.QueryTypes.SELECT}).then(result =>{
           if (result && result[0].cnt >0 ) {
              return {code:400,msg:"user name already taken."};
           }else {
               return null;
           }
       });
    }
    processCreateChef(attr){
        userService.baseCreate(attr);
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