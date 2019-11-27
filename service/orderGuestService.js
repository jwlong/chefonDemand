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
            this.getModel().findAll({
                where: {order_id: updateOrderGuestList.order_id,active_ind:activeIndStatus.ACTIVE}, transaction: t
            }).then(guestListResp => {
                let requiredAddList = updateOrderGuestList.guest_list;
                let actInsertArr = [];
                let oldNeedDeleted = [];
                requiredAddList.forEach(value => {
                    value.order_id = updateOrderGuestList.order_id;
                    if (guestListResp) {
                        let notSame = false;
                        guestListResp.forEach(oldGuest => {
                            if (oldGuest.guest_name !== value.guest_name) {
                                notSame = true;
                                oldNeedDeleted.push(oldGuest);
                            }
                        })
                        if (notSame) {
                            actInsertArr.push(value);
                        }
                    } else {
                        actInsertArr.push(value);
                    }
                })
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
        this.getModel().findOne({where:{order_id:attrs.order_id,order_guest_id:attrs.order_guest_id}}).then(
            guest =>{
                if (guest && guest.active_ind === activeIndStatus.ACTIVE) {
                    // replace
                    let orderItemPrmArr = [];

                    attrs.order_item_list.forEach(item => {
                        let orderItemPrm = orderItemService.getModel().findAll({where:{order_id:attrs.order_id,order_guest_id:attrs.order_guest_id},transaction:t}).then(items => {
                            if (items) {
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

    }
}
module.exports = new OrderGuestService()