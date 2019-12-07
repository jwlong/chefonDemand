import BaseService from './baseService.js'
import {AutoWritedOrderItemOption} from '../common/AutoWrite.js'
import db from "../config/db";
import activeIndStatus from "../model/activeIndStatus";

@AutoWritedOrderItemOption
class OrderItemOptionService extends BaseService {
    constructor() {
        super(OrderItemOptionService.model)
    }
    getOptionsByItems(itemList) {
        let promiseArr = [];
        itemList.forEach(item => {
            let p = this.getModel().findAll({where:{order_item_id:item.order_item_id,active_ind:activeIndStatus.ACTIVE}}).then(options => {
                let result = {};
                result =  item.toJSON();
                result.guest_order_item_option_list = options;
                console.log("Guest options =============>",result);
                return result;
            })
            promiseArr.push(p);
        })
        return Promise.all(promiseArr);

    }
}
//module.exports = new OrderItemOptionService()
export default new OrderItemOptionService()