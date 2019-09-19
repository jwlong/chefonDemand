import BaseService from './baseService.js'
import {AutoWritedChefMenu} from '../common/AutoWrite.js'
import db from "../config/db";
import chefService from './chefService'
import activeIndStatus from "../model/activeIndStatus";
import menuItemService from './menuItemService'
import menuItemOptionService from './menuItemOptionService'
import MenuDetailResponse from "../model/requestModel/MenuDetailResponse";
import utils from "../common/utils";

@AutoWritedChefMenu
class ChefMenuService extends BaseService{
    constructor(){
        super(ChefMenuService.model)
    }
    getMenuByMenuId(userId,menuId) {
        //no user id only can get public menu
        let criteria = {menu_id:menuId,act_ind:activeIndStatus.ACTIVE}

        if (!userId  || (userId && chefService.isChefWithUserId(userId))) {
            criteria.public_ind = 1;
        }
        return this.getModel().findOne({attributes:['chef_id','menu_id','menu_name',
                'menu_code','menu_desc','public_ind'],where:criteria}).then(resp => {
                    let result  = resp.toJSON();
            return menuItemService.baseFindByFilter(['menu_item_id','seq_no','item_type_id','max_choice','note','optional'],{menu_id:menuId,act_ind:activeIndStatus.ACTIVE}).then(menuItems => {

                return menuItemOptionService.getMenuItemOptionsByMenuItems(menuItems).then(menuItemResult => {
                    result.menu_item_list = menuItemResult;
                    return result;
                })

            })
        });
    }
}
module.exports = new ChefMenuService()