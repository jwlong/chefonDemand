import BaseService from './baseService.js'
import {AutoWritedOrder} from '../common/AutoWrite.js'
import orderItemService from './orderItemService'
import db from "../config/db";

@AutoWritedOrder
class OrderService extends BaseService{
    constructor(){
        super(OrderService.model)
    }
    createOrderByMenuId(createOrderRequest,menu) {
        db.transaction(t=> {
            let orderItemList = createOrderRequest.order_item_list;
            let addOrder = delete createOrderRequest.order_item_list;
            return this.baseCreate(addOrder,{transaction:t}).then(resp => {
                //orderItemService.baseCreate()
                return orderItemService.addItemList(orderItemList,t).then(
                    result => {
                        return resp.order_id;
                    }
                );
            })
        })
    }
}
module.exports = new OrderService()