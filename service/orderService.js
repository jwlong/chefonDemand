import BaseService from './baseService.js'
import {AutoWritedOrder} from '../common/AutoWrite.js'
import orderItemService from './orderItemService'
import orderGuestService from './orderGuestService'
import db from "../config/db";
import chefMenuService from './chefMenuService'
import activeIndStatus from "../model/activeIndStatus";
import baseResult from "../model/baseResult";

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

    getOneByOrderId(order_id,t) {
        return this.getOne({where:{order_id:order_id,active_ind:activeIndStatus.ACTIVE},transaction:t});
    }

    cancelOrderByOrderId(attrs,user_id) {
        return db.transaction(t=> {
           return this.getOneByOrderId(attrs.order_id,t).then(order => {
                if (order.user_id !== user_id){
                    throw baseResult.ORDER_NOT_BELONG_USER
                }
               return  chefMenuService.getModel().findOne({where:{menu_id:order.menu_id,active_ind:activeIndStatus.ACTIVE},transaction:t}).then(
                    chefMenu=> {
                        if (!moment().add(chefMenu.cancel_hours?menu.cancel_hours:0, 'hours').isBefore(moment(order.create_on))){
                            throw baseResult.ORDER_CANCEL_WITHIN_HOURS;
                        }else {
                            return this.cancelOrderAndRefs(order,t)
                        }
                    }
                )

            })

        })

    }

    cancelOrderAndRefs(order,t) {
        return this.baseUpdate({active_ind:activeIndStatus.DELETE},{where:{order_id:order.order_id,active_ind:activeIndStatus.ACTIVE},transaction:t}).then(updatedOrder => {
            // delete order item
            return orderItemService.cancelItemAndOptions(order.order_id,t);
        })


    }

    getOrdersByUserId(attrs) {
        let queryOrder = ` select o.order_id,o.event_date,o.total,o.order_status`;
        let sql = ` from t_order o`;
        if (attrs.chef_id) {
            sql += ` left join t_chef_menu menu on o.menu_id = menu.menu_id and menu.active_ind = 'A' `
        }
        let whereSql = `where 1=1 `;
        let orderSql = ``;
        if (attrs.chef_id) {
            whereSql += ' and menu.chef_id = :chef_id and o.user_id=:user_id';
            orderSql  = queryOrder+sql+whereSql;

        }else {
            whereSql += `and o.user_id=:user_id`
            orderSql = queryOrder + sql + whereSql;

        }
        return db.query(chefSql,{replacements:attrs,type:db.QueryTypes.SELECT}).then(orderList => {
            let result = {};
            result.order_list = orderList;
            let oPrmArr = [];
            orderList.forEach( order => {
                let p = orderItemService.getItemsAndOptionsByOrder(order.order_id).then(itemList => {
                    order.order_item_list = itemList;
                    return order;
                });
                let p2 = orderGuestService.getModel().findAll({where:{order_id:order_id,active_ind:activeIndStatus.ACTIVE}}).then(guestList =>{
                    order.guest_list = guestList;
                    return order;
                })
                oPrmArr.push(p);
                oPrmArr.push(p2);
            })
            return Promise.all(oPrmArr);
        })

/*



        `left join t_order_item item on item.order_id = o.order_id  and  item.active_ind = 'A'
        left join t_order_item_option op on op.order_item_id = item.order_item_id and op.active_ind = 'A'
        where o.user_id = :user_id `;


        if (attrs.chef_id) {
           let sql = ``

        }else {

        }*/

    }
}
module.exports = new OrderService()