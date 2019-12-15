import BaseService from '../baseService.js'
import {AutoWritedMenuItem} from '../../common/AutoWrite.js'
import activeIndStatus from "../../model/activeIndStatus";

@AutoWritedMenuItem
class MenuItemService extends BaseService{
    constructor(){
        super(MenuItemService.model)
    }

    getActiveMenuListByMenuId(menu_id,t) {
        return this.getModel().findAll({where:{menu_id:menu_id,active_ind:activeIndStatus.ACTIVE},transaction:t});
    }
    /**
     * @param menu_id
     * @param status
     * @param t
     * @returns {PromiseLike<T> | Promise<T>}
     */
    batchUpdateStatus(menu_id,status,t) {
        return this.getModel().findAll({where:{menu_id:menu_id,active_ind:activeIndStatus.ACTIVE},transaction:t}).then(
            itemList => {
                return this.baseUpdate({active_ind:status},{where:{menu_id:menu_id,active_ind:activeIndStatus.ACTIVE},transaction:t}).then(cnt =>{
                    return itemList;
                })
            }

        )
    }

    insertItem(value, t) {
                //create
        value.menu_item_id = null;
        return this.baseCreate(value,{transaction:t})
    }

}
module.exports = new MenuItemService()