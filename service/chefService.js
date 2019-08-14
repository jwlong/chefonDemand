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

    async processCreateChef(createdUser){
        try {
            if (createdUser && createdUser.user_id) {
                //add chef
                let chef = {};
                chef.user_id = createdUser.user_id;

                chef.chef_id = await this.max('chef_id')+1;
                // attr.short_desc = attr.short_description;
                //attr.detail_desc = attr.detail_description;
                chef.active_ind = 'A';
                chef.create_by = createdUser.create_by;
                chef.update_by = createdUser.update_by;
                //insert a new record to t_chef
                console.log("it will insert chef",chef);
                let result = await  this.baseCreate(chef);
                if (result) {
                    return result;
                }
            }
        }catch (e) {
            throw e;
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