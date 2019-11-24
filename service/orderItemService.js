import BaseService from './baseService.js'
import {AutoWritedOrderItem} from '../common/AutoWrite.js'
import db from "../config/db";
import orderItemOptionService from './orderItemService'
@AutoWritedOrderItem
class OrderItemService extends BaseService {
    constructor() {
        super(OrderItemService.model)
    }
    addItemList(orderItemList ,t) {
        let promiseArr = [];
        orderItemList.forEach( item => {
            let itemOptions = item.order_item_option_list;
            delete  item.order_item_option_list;
           let p = this.baseCreate(item,{transaction:t}).then(insertedItem => {
                 itemOptions.forEach(option => {
                     option.order_item_id = insertedItem.order_item_id;
                 })
                 return orderItemOptionService.baseCreateBatch(itemOptions,{transaction:t})
            });
           promiseArr.push(p);
        })
        return Promise.all(promiseArr);
    }
}
module.exports = new OrderItemService()