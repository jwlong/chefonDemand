import BaseService from './baseService.js'
import {AutoWritedChefMenu} from '../common/AutoWrite.js'
import db from "../config/db";
import chefService from './chefService'
import activeIndStatus from "../model/activeIndStatus";
import menuItemService from './menuItemService'
import menuItemOptionService from './menuItemOptionService'
import baseResult from "../model/baseResult";

@AutoWritedChefMenu
class ChefMenuService extends BaseService{
    constructor(){
        super(ChefMenuService.model)
    }

    preparedChefMenu(attr) {
        //default value
        attr.public_ind = 0;
        attr.applied_meal = 3;
        attr.unit_price = 0.0000;
        attr.instant_ind = 1;
        attr.min_pers = 1;
        attr.event_duration_hr = 2.00;
        attr.chef_arrive_prior_hr = 1;
        attr.act_ind = 1;
    }
    createMenuNameByChefId(attr) {
        this.preparedChefMenu(attr);
        return db.transaction(t=> {
           return this.nextId('menu_id',{transaction:t}).then(nextId => {
                attr.menu_id = nextId;
                return this.baseCreate(attr,{transaction:t})
            })
        })
    }


    getMenuByMenuId(criteria) {
        //no user id only can get public menu
        return this.getModel().findOne({attributes:['chef_id','menu_id','menu_name',
                'menu_code','menu_desc','public_ind'],where:criteria}).then(resp => {
                    let result  = resp.toJSON();
            return menuItemService.baseFindByFilter(['menu_item_id','seq_no','item_type_id','max_choice','note','optional'],{menu_id:criteria.menu_id,act_ind:activeIndStatus.ACTIVE}).then(menuItems => {

                return menuItemOptionService.getMenuItemOptionsByMenuItems(menuItems).then(menuItemResult => {
                    result.menu_item_list = menuItemResult;
                    return result;
                })

            })
        });
    }
}
module.exports = new ChefMenuService()