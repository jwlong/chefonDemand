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
    processCreateChef(attr){
        let createdUser = userService.baseCreate(attr);
        if (createdUser && createdUser.user_id) {
            //add chef
            attr.chefId = (this.max('chef_id')?this.max('chef_id')+1 : 1);
            attr.short_desc = attr.short_description;
            attr.detail_desc = attr.detail_description;
            attr.active_ind = 0;
            //insert a new record to t_chef
            let newChef = this.baseCreate(attr);
            // insert a new record to t_chef_cuisine
            console.log(newChef)
            // this is test branches
            // insert a new record to  t_chef_language

            //


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