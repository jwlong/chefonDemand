import BaseService from '../baseService.js'
import {AutoWritedMenuCuisine} from '../../common/AutoWrite.js'
import Sequelize from 'sequelize'
import activeIndStatus from "../../model/activeIndStatus";
import db from "../../config/db";
const Op = Sequelize.Op
@AutoWritedMenuCuisine
class MenuPhotoService extends BaseService{
    constructor(){
        super(MenuPhotoService.model)
    }

    getAvailableCuisineTypes() {
        let  sql = `select distinct  mc.cuisine_type_id,ctype.cuisine_type_name,ctype.description from t_menu_cuisine mc
                    left join t_chef_menu cm on cm.menu_id = mc.menu_id and cm.active_ind = :status
                    left join t_cuisine_type ctype on ctype.cuisine_type_id = mc.cuisine_type_id and ctype.active_ind = :status`;
        return db.query(sql,{replacements:{status:activeIndStatus.ACTIVE},type:db.QueryTypes.SELECT}).then(detail => {
            let result = {};
            result.avail_cuisine_types = detail;
            return result;
        })


    }
}
module.exports = new MenuPhotoService()