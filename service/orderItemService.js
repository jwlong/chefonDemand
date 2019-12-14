import BaseService from './baseService.js'
import {AutoWritedOrderItem} from '../common/AutoWrite.js'
import db from "../config/db";
import orderItemOptionService from './orderItemOptionService'
import orderGuestService from './orderGuestService'
import activeIndStatus from "../model/activeIndStatus";
@AutoWritedOrderItem
class OrderItemService extends BaseService {
    constructor() {
        super(OrderItemService.model)
    }
    addItemList(orderItemList,guest,t) {
        let promiseArr = [];
        orderItemList.forEach( item => {
            item.order_guest_id = guest.order_guest_id;
            item.order_id = guest.order_id;
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

    updateItemAndOptions(items, attrs, t) {
        let promiseArr = [];
        items.forEach(orderItem => {
            // update order option
            let optionUpdatePromise = orderItemOptionService.baseUpdate({active_ind:activeIndStatus.REPLACE},{where:{order_item_id:orderItem.order_item_id,active_ind:activeIndStatus.ACTIVE}})
            promiseArr.push(optionUpdatePromise);
            let p =  this.baseUpdate({active_ind:activeIndStatus.REPLACE},{where:{order_id:attrs.order_id,order_guest_id:attrs.order_guest_id},transaction:t}).then(
                resp => {
                    return this.newInsert(attrs,t);
                }
            );
            promiseArr.push(p);
        })
        return Promise.all(promiseArr);
    }

    newInsert(attrs,t) {
        let orderItmes = attrs.order_item_list;
        let itemPrmArr = [];
        orderItmes.forEach(item => {
            item.order_id = attrs.order_id;
            item.seq_no = item.seq_no;
            item.order_guest_id = attrs.order_guest_id;
           let p = this.baseCreate(item,{transaction:t}).then(insertedItem => {
                let itemOptions = item.order_item_option_list;
                let pOptions = [];
                itemOptions.forEach(option => {
                    option.order_item_id = insertedItem.order_item_id;
                    option.seq_no = option.seq_no;
                    pOptions.push(orderItemOptionService.baseCreate(option,{transaction:t}));
                })
                return Promise.all(pOptions);
            })
            itemPrmArr.push(p);
        })
        return Promise.all(itemPrmArr);
    }

    cancelItemAndOptions(order_id, t) {
          return this.getModel().findAll({where:{order_id:order_id
                   ,active_ind:activeIndStatus.ACTIVE},transaction:t}).then(itemList => {
               if (itemList) {
                   let promiseArr = [];
                   itemList.forEach(item => {
                       let p = this.baseUpdate({active_ind:activeIndStatus.DELETE},{where:
                               {order_id:order_id},transaction:t}).then(updated => {
                           return this.cancelOptionsByItemId(item.order_item_id,t).then(resp => {
                               return orderGuestService.baseUpdate({active_ind:activeIndStatus.DELETE},{where:{order_id:order_id,active_ind:activeIndStatus.ACTIVE},transaction:t});
                           })
                       })
                       promiseArr.push(p);
                   })
                   return Promise.all(promiseArr);
               }

           })
    }

    cancelOptionsByItemId(order_item_id,t) {
       return orderItemOptionService.baseUpdate({active_ind:activeIndStatus.DELETE},{where:{order_item_id:order_item_id},transaction:t});
    }

    getItemsAndOptionsByOrder(order_id) {
       return this.getModel().findAll({where:{order_id:order_id,active_ind:activeIndStatus.ACTIVE}}).then(itemList => {
            let itemPrmArr = [];
            itemList.forEach(item => {

                let pItem = orderItemOptionService.getModel().findAll({where:{order_item_id:item.order_item_id,active_ind:activeIndStatus.ACTIVE}}).then(options => {
                    let result = {};
                    result = item.toJSON();
                    result.order_item_option_list = options;
                    return result;

                })
                itemPrmArr.push(pItem);
            })
            return Promise.all(itemPrmArr);

        })
    }

}
//module.exports = new OrderItemService()
export default new OrderItemService()