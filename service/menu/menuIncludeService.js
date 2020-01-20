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
        let newList = [];
        let p1 = null;
        if (activeIndStatus.REPLACE === status ) {
            p1 = this.baseUpdate({active_ind:status},{where:{menu_id:last_menu_id,active_ind:activeIndStatus.ACTIVE},transaction:t});

        }else if (activeIndStatus.DELETE === status) {
            p1 = this.baseDelete({menu_id:last_menu_id},{transaction:t});
        }
        promiseArr.push(p1);
        return Promise.all(promiseArr).then(resp => {
            if (!Array.isArray(attrs)) {
                attrs = attrs.include_items;
            }

            attrs.forEach(menuInclude => {
                menuInclude.menu_id = new_menu_id;
                menuInclude.parent_menu_id = last_menu_id;
                menuInclude.active_ind = activeIndStatus.ACTIVE;
                newList.push(menuInclude);
            })
            return this.baseCreateBatch(newList,{transaction:t});
        })
    }

}

module.exports = new MenuIncludeService()