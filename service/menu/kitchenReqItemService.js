import BaseService from '../baseService.js'
import {AutoWritedKitchenReqItem} from '../../common/AutoWrite.js'
import Sequelize from 'sequelize'
import activeIndStatus from "../../model/activeIndStatus";
const Op = Sequelize.Op
@AutoWritedKitchenReqItem
class KitchenReqItemService extends BaseService{
    constructor(){
        super(KitchenReqItemService.model)
    }

    getMenuKitchenRequirementItems() {
        let fields = ['kitchen_req_item_id','item_name','item_desc'];
        return this.baseFindByFilter(fields,{active_ind:activeIndStatus.ACTIVE}).then(list => {
            let result = {};
            result.kitchen_req_items = list;
            return result;
        })
    }
}

module.exports = new KitchenReqItemService()