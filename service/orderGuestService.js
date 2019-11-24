import BaseService from './baseService.js'
import {AutoWritedOrderGuest} from '../common/AutoWrite.js'
import db from "../config/db";
import activeIndStatus from "../model/activeIndStatus";
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

    updateOrderGuestSelectionByOrderId(attrs) {
        this.getModel().findOne({where:{order_id:attrs.order_id,order_guest_id:attrs.order_guest_id}}).then(
            guest =>{
                if (guest) {

                }else {
                    throw baseResult.ORDER_SECTION_GUEST_LIST_INVALID;
                }
            }
        )

    }
}
module.exports = new OrderGuestService()