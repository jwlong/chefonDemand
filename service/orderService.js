import BaseService from './baseService.js'
import {AutoWritedOrder} from '../common/AutoWrite.js'
import orderItemService from './orderItemService'
import orderGuestService from './orderGuestService'
import db from "../config/db";
import chefMenuService from './chefMenuService'
import activeIndStatus from "../model/activeIndStatus";
import baseResult from "../model/baseResult";
import moment from  'moment'

@AutoWritedOrder
class OrderService extends BaseService{
    constructor(){
        super(OrderService.model)
    }
    createOrderByMenuId(createOrderRequest) {
       return db.transaction(t=> {
            let orderItemList = createOrderRequest.order_item_list;
            let addOrder = createOrderRequest;
            console.log("createOrderRequest ===>",addOrder,orderItemList)

            return this.nextId('order_id',{transaction:t}).then(nextId => {
                addOrder.order_id = nextId;
                if (!addOrder.accept_kitchen_requirement_chef_note_ind) {
                    addOrder.accept_kitchen_requirement_chef_note_ind = 0;
                }
                if (!addOrder.accept_terms_ind)  {
                    addOrder.accept_terms_ind = 0;
                }
                return this.baseCreate(addOrder,{transaction:t}).then(resp => {
                    return orderGuestService.createGuestByCreateOrderRequest(createOrderRequest,resp.order_id,t).then(createdGuest => {
                        //orderItemService.baseCreate()
                        console.log("create guest list =>",createdGuest)
                        return orderItemService.addItemList(orderItemList,createdGuest,t).then(
                            result => {
                                console.log("order ==> order_id:"+resp.order_id)
                                return resp.order_id;
                            }
                        );

                    })
                })

            })

        })
    }
    createOrderAndGuestList(createOrderRequest) {
        // create order
        return this.nextId('order_id',{transaction:t}).then(nextId => {
            let addOrder = {};
            addOrder.order_id = nextId;
            if (!addOrder.accept_kitchen_requirement_chef_note_ind) {
                addOrder.accept_kitchen_requirement_chef_note_ind = 0;
            }
            if (!addOrder.accept_terms_ind) {
                addOrder.accept_terms_ind = 0;
            }
            return this.baseCreate(addOrder,{transaction:t}).then(resp => {
                let guest = {};
                guest.order_id = resp.order_id;

            })

        })

    }
    getOneByOrderId(order_id,t) {
        return this.getOne({where:{order_id:order_id,active_ind:activeIndStatus.ACTIVE},transaction:t});
    }

    cancelOrderByOrderId(attrs) {
        return db.transaction(t=> {
           return this.getOneByOrderId(attrs.order_id,t).then(order => {
                if (order.user_id !== attrs.user_id){
                    throw baseResult.ORDER_NOT_BELONG_USER
                }
               return  chefMenuService.getModel().findOne({where:{menu_id:order.menu_id,active_ind:activeIndStatus.ACTIVE},transaction:t}).then(
                    chefMenu=> {
                   /*     console.log(moment().add(chefMenu.cancel_hours?chefMenu.cancel_hours:0, 'hours'),moment(order.create_on))*/
                        if (!moment().add(chefMenu.cancel_hours?chefMenu.cancel_hours:0, 'hours').isBefore(moment(order.create_on))){
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
            whereSql += ' and menu.chef_id = :chef_id ';
            orderSql  = queryOrder+sql+whereSql;

        }else {
            whereSql += `and o.user_id=:user_id`
            orderSql = queryOrder + sql + whereSql;

        }
        return db.query(orderSql,{replacements:attrs,type:db.QueryTypes.SELECT}).then(orderList => {
            let result = {};
            result.order_list = orderList;
            let oPrmArr = [];
            orderList.forEach( order => {
                let p = orderItemService.getItemsAndOptionsByOrder(order.order_id).then(itemList => {
                    order.order_item_list = itemList;
                    return order;
                });

               let p2 = orderGuestService.getGuestListAndOptionsByOrder(order.order_id).then(guestList => {
                   order.guest_list =   guestList;
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

    getOrderStatisticsByChefId(chef_id) {
        let last30Days = moment().subtract(30, 'days').format("YYYY-MM-DD HH:mm:ss");
        let monthBeginDate = moment().startOf('month').format("YYYY-MM-DD HH:mm:ss");
        let sql = `select
            (case when o.create_on >:last30Days then count(distinct o.order_id) end) 30_days_bookings,
            (case when view.viewed_on>:last30Days then count(distinct view.view_id) end) 30_days_views,
            avg(rating.overall_rating) overall_rating,
            count(distinct rating.rating_id) num_of_review,
            (case when o.create_on > :monthBeginDate then sum(o.total) end )month_to_day_earnings,
            CONCAT (ROUND(case when  (count(distinct am.message_id) +3 /count(distinct tm.message_id)) >1 then 1 else
            (count(distinct am.message_id)+3 /count(distinct tm.message_id)) end)*100 ,'%') response_rate
            from t_order o
            left join t_chef_menu m on o.menu_id = m.menu_id and m.active_ind = 'A'
            left join t_user_rating rating on o.order_id = rating.order_id and rating.active_ind = 'A'
            left join t_user_menu_view view on m.menu_id = view.menu_id and view.active_ind = 'A'
            left join t_message am on  am.to_user_id = o.user_id and am.active_ind = 'A'
            left join t_message tm on  tm.from_user_id = o.user_id and tm.active_ind = 'A'
            where m.chef_id = :chef_id and o.active_ind = 'A' and o.order_status = 'C' ` ;
        return db.query(sql,{replacements:{chef_id:chef_id,last30Days:last30Days,monthBeginDate:monthBeginDate},type:db.QueryTypes.SELECT});

    }

    updateMenuIdWithNewMenuId(oldMenuId, new_menu_id,t) {
        return this.baseUpdate({menu_id:new_menu_id},{where:{menu_id:oldMenuId,active_ind:activeIndStatus.ACTIVE},transaction:t})
    }
}
// module.exports = new OrderService()
export default new OrderService()
