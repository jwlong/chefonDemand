import BaseService from '../baseService.js'
import {AutoWritedMenuInclude} from '../../common/AutoWrite.js'
import Sequelize from 'sequelize'
import activeIndStatus from "../../model/activeIndStatus";
import chefMenuService from "../chefMenuService";
@AutoWritedMenuInclude
class MenuIncludeService extends BaseService{
    constructor(){
        super(MenuIncludeService.model)
    }

    copyMenuInclude(menu_id,new_menu_id,t) {
        return this.getModel().findAll({where:menu_id}).then(includeList => {
            let copyIncludeList = [];
            includeList.forEach(inc => {
                 inc.menu_id = new_menu_id;
                 copyIncludeList.push(inc);
            })
            return this.baseCreateBatch(copyIncludeList,{transaction:t});
        })
    }
    getItemInclude(menu_id,include_item_id,t) {
        return this.getOne({where:{menu_id:menu_id,include_item_id:include_item_id},transaction:t});
    }

    updateDirectly(status, last_menu_id, new_menu_id, attrs, t) {
        console.log("updateMenuIncludeItemsDirectly...")
        let promiseArr = [];
        // check include_item is exits or not
        attrs.forEach(item => {
            item.active_ind = activeIndStatus.ACTIVE;
            let p = this.getItemInclude(last_menu_id,item.include_item_id,t).then(includeItem => {
                if (includeItem) {

                    return this.baseUpdate(item,{where:{menu_id:last_menu_id,include_item_id:item.include_item_id},transaction:t})
                } else {
                    item.menu_id = last_menu_id;
                    return this.baseCreate(item,{transaction:t});
                }
            })
            promiseArr.push(p);
        })
        return Promise.all(promiseArr);
    }

}

module.exports = new MenuIncludeService()