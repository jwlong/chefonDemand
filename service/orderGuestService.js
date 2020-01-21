import BaseService from './baseService.js'
import {AutoWritedOrderGuest} from '../common/AutoWrite.js'
import db from "../config/db";
import activeIndStatus from "../model/activeIndStatus";
import orderItemService from './orderItemService'
import orderItemOptionService from './orderItemOptionService'
import baseResult from "../model/baseResult";

@AutoWritedOrderGuest
class OrderGuestService extends BaseService {
    constructor() {
        super(OrderGuestService.model)
    }

    updateOrderGuestListByOrderId(updateOrderGuestList) {
       return db.transaction(t => {
           return this.getModel().findAll({
                where: {order_id: updateOrderGuestList.order_id,active_ind:activeIndStatus.ACTIVE}, transaction: t
            }).then(guestListResp => {
                let requiredAddList = updateOrderGuestList.guest_list;
                let actInsertArr = [];
                if (requiredAddList && requiredAddList.length > updateOrderGuestList.num_of_guest ) {
                    throw 'the guest list size can be less than t_order.num_of_guest'
                }

                let matchOldguestNameArr = [];
                let oldNeedDeleted = [];
                requiredAddList.forEach(value => {
                    value.order_id = updateOrderGuestList.order_id;
                    if (guestListResp && guestListResp.length > 0) {
                        let notSame = false;
                        if (!guestListResp.some(oldGuest => {
                            return oldGuest.guest_name === value.guest_name;
                        })) {
                            actInsertArr.push(value);
                        }else {
                            matchOldguestNameArr.push(value);
                        }
                    } else {
                        actInsertArr.push(value);
                    }
                })
               console.log("matchOldguestNameArr =>",matchOldguestNameArr)
               guestListResp.forEach(oldGuest => {
                   if (!matchOldguestNameArr.some(item => {
                       return item.guest_name === oldGuest.guest_name;
                   })) {
                       oldNeedDeleted.push(oldGuest);
                   }
               })

               console.log("add arr,",actInsertArr);
               console.log("delete arr,",oldNeedDeleted);

                return this.baseCreateBatch(actInsertArr,{transaction:t}).then(resp => {
                    if (oldNeedDeleted.length > 0) {
                        let promiseArr = [];
                        oldNeedDeleted.forEach(oldGuest => {
                            promiseArr.push(this.baseUpdate({active_ind:activeIndStatus.DELETE},{where:
                                {order_id:oldGuest.order_id,guest_name:oldGuest.guest_name},transaction:t}));
                        })
                        return Promise.all(promiseArr);
                    }
                })

            })
        })
    }

    updateOrderGuestSelectionByOrderId(attrs,menu) {
      return  db.transaction(t=> {
            return this.getModel().findOne({where:{order_id:attrs.order_id,order_guest_id:attrs.order_guest_id}}).then(
                guest =>{
                    debugger
                    if (guest && guest.active_ind === activeIndStatus.ACTIVE) {
                        // replace
                        let orderItemPrmArr = [];

                        attrs.order_item_list.forEach(item => {
                            let orderItemPrm = orderItemService.getModel().findAll({where:{order_id:attrs.order_id,order_guest_id:attrs.order_guest_id,active_ind:activeIndStatus.ACTIVE},transaction:t}).then(items => {
                                debugger
                                console.log("item list =>",items);
                                if (items && items.length > 0) {
                                    // replaces
                                    return orderItemService.updateItemAndOptions(items,attrs,t);

                                }else {
                                    // new add
                                    return orderItemService.newInsert(attrs,t);
                                }
                            })
                            orderItemPrmArr.push(orderItemPrm);
                        })
                        return Promise.all(orderItemPrmArr);

                    }else {
                        // new add
                        throw baseResult.ORDER_SECTION_USER_ONLY_ACTIVE_GUEST;
                    }
                }
            )

        })


    }

    getGuestListAndOptionsByOrder(order_id) {
        return this.getModel().findAll({where:{order_id:order_id,active_ind:activeIndStatus.ACTIVE}}).then(guestList =>{
            let promiseArr = [];
            guestList.forEach(guest => {
                let p = orderItemService.getModel().findAll({where:{order_id:order_id,order_guest_id:guest.order_guest_id,active_ind:activeIndStatus.ACTIVE}}).then(itemList => {
                    let result = {};
                    result = guest.toJSON();
                    return orderItemOptionService.getOptionsByItems(itemList).then(list => {
                        result.guest_order_item_list = list;
                        return result
                    });
                  ;
                })
                promiseArr.push(p);
            })
            return Promise.all(promiseArr);
        })
    }

    createGuestByCreateOrderRequest(createOrderRequest,order_id,t) {
        let guest = {};
        guest.order_id = order_id;
        guest.guest_name = createOrderRequest.user_name;
        guest.email_address = createOrderRequest.email_address;
        guest.contact_no = createOrderRequest.contact_no;
        return this.nextId('order_guest_id',{transaction:t}).then(
            nextId => {
                guest.order_guest_id = nextId;
                return this.baseCreate(guest,{transaction:t});
            }
        )
    }
}
module.exports = new OrderGuestService()