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


    updateDirectly(status, last_menu_id, new_menu_id, attrs, t) {
        console.log("updateMenuIncludeItemsDirectly...")
        return chefMenuService.baseUpdate({active_ind:activeIndStatus.REPLACE,public_ind:0},{where:{menu_id:last_menu_id,active_ind:activeIndStatus.ACTIVE},transaction:t}).then(updatedMenu => {
            let promiseArr = [];
            let newList = [];
            let p1 = this.baseUpdate({active_ind:status},{where:{menu_id:last_menu_id,active_ind:activeIndStatus.ACTIVE},transaction:t});
            promiseArr.push(p1);
            attrs.forEach(item => {
                item.menu_id = new_menu_id;
                newList.push(item);
            })
            promiseArr.push(this.baseCreateBatch(newList,{transaction:t}));
            return Promise.all(promiseArr);
        })
    }

}

module.exports = new MenuIncludeService()