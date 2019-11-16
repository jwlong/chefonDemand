import BaseService from '../baseService.js'
import {AutoWritedMenuItem} from '../../common/AutoWrite.js'
import activeIndStatus from "../../model/activeIndStatus";

@AutoWritedMenuItem
class MenuItemService extends BaseService{
    constructor(){
        super(MenuItemService.model)
    }

    batchUpdateStatus(menu_id,status,t) {
        return this.baseUpdate({active_ind:status},{where:{menu_id:menu_id,active_ind:activeIndStatus.ACTIVE},transaction:t});
    }
}
module.exports = new MenuItemService()