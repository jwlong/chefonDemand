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
        if (value.menu_item_id)  {
            return this.getModel().findOne({where:{menu_item_id:value.menu_item_id},transaction:t}).then(item => {
                if (item) {
                    // update
                    return this.baseUpdate(value,{where:{menu_item_id:value.menu_item_id},transaction:t}).then(updateCtn => {
                        return item;
                    })
                }else {
                    //create
                    return this.baseCreate(value,{transaction:t})
                }
            })
        }
    }
}
module.exports = new MenuItemService()