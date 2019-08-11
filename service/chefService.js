import BaseService from './baseService.js'
import {AutoWritedChefModel} from '../common/AutoWrite.js'
import db from '../config/db.js'
@AutoWritedChefModel
class ChefService extends BaseService{
    constructor(){
        super(ChefService.model)
    }
    getChefList(attr) {
        return ChefService.model.getChefList(attr)
    }
    checkBeforeCreate(attr,res) {
        var sql = "select count(chef.*) from t_chef chef left join t_user u on u.user_id = chef.user_id " +
            " where u.user_name = :user_name";
        let cnt = db.query(sql,{replacements:{user_name:attr.user_name},type:db.QueryTypes.SELECT});
        if (cnt && cnt >0 ) {
            res.status(400).json({msg:'user name already taken.'});
        }
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