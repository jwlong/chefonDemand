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
                    let newOrderId = resp.order_id;
                    return orderItemService.addItemList(orderItemList, newOrderId, t).then(
                        result => {
                            console.log("order ==> order_id:"+resp.order_id)
                            return resp.order_id;
                        }
                    );
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
                        console.log("cancel hours:%s",chefMenu.cancel_hours);
                        console.log(moment(order.create_on).add(chefMenu.cancel_hours?chefMenu.cancel_hours:0, 'hours'),moment())
                        if (moment(order.create_on).add(chefMenu.cancel_hours?chefMenu.cancel_hours:0, 'hours').isBefore(moment())){
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
        let queryOrder = ` select distinct o.order_id,o.event_date,o.total,o.order_status,u.user_name,u.first_name,o.num_of_guest `;
        let sql = ` from t_order o `;
        if (attrs.chef_id) {
            sql += ` left join t_chef_menu menu on o.menu_id = menu.menu_id and menu.active_ind = 'A' `
        }
        sql += ` left join t_user u on u.user_id = o.user_id and u.active_ind= 'A' `
        let whereSql = ` where 1=1 and o.active_ind = 'A'  `;
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
                    return orderGuestService.getGuestListAndOptionsByOrder(order.order_id).then(guestList => {
                        order.guest_list =   guestList;
                        return order;
                    })
                });
                oPrmArr.push(p);
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

    getOrderStatisticsByChefId(chef_id ) {
        let last30Days = moment().subtract(30, 'days').format("YYYY-MM-DD HH:mm:ss");
        let monthBeginDate = moment().startOf('month').format("YYYY-MM-DD HH:mm:ss");
        let sql = `select
            count(distinct case when o.create_on >:last30Days then  o.order_id end) 30_days_bookings,
            count(distinct case when view.viewed_on>:last30Days then view.view_id end) 30_days_views,
            avg(rating.overall_rating) overall_rating,
            count(distinct rating.rating_id) num_of_review,
            sum(distinct case when o.create_on > :monthBeginDate then  o.total end ) month_to_day_earnings
            from t_order o
            left join t_chef_menu m on o.menu_id = m.menu_id and m.active_ind = 'A'
            left join t_chef chef on chef.chef_id = m.chef_id and chef.active_ind = 'A'
            left join t_user_rating rating on o.order_id = rating.order_id and rating.active_ind = 'A'
            left join t_user_menu_view view on m.menu_id = view.menu_id and view.active_ind = 'A'
            where m.chef_id = :chef_id and o.active_ind = 'A'  and o.order_status = 'C' group by m.chef_id and m.active_ind = 'A' ` ;

        return db.query(sql,{replacements:{chef_id:chef_id,last30Days:last30Days,monthBeginDate:monthBeginDate},type:db.QueryTypes.SELECT}).then(resp => {
            if (resp && resp.length > 0) {
                let result = resp[0];
                return result;
            }
        });

    }

    getResponseRate(chef_id) {
        let sql = ` select  count(distinct am.message_id) custToChefMsgCnt,
                    count(distinct tm.message_id) chefReplyCnt
            from t_order o
            left join t_chef_menu m on o.menu_id = m.menu_id and m.active_ind = 'A'
            left join t_chef chef on chef.chef_id = m.chef_id and chef.active_ind = 'A'
            left join t_message am on am.to_user_id = chef.user_id and am.from_user_id = o.user_id and am.active_ind = 'A'
            left join t_message tm on tm.parent_message_id is not null and tm.from_user_id = chef.user_id and tm.to_user_id = o.user_id and tm.active_ind = 'A'
            and m.chef_id =:chef_id and o.active_ind = 'A' `;

        let missReponseCntSql = ` select count(distinct o.order_id) missCnt from  t_order o
        left join t_chef_menu m on m.menu_id = o.menu_id and m.active_ind = 'A'
        where o.active_ind = 'A' and m.chef_id = :chef_id and  ( (order_status = 'C' and 
        o.confirmed_datetime > DATE_ADD(o.create_on,INTERVAL 1 DAY) 
        or (order_status = 'R' and now() > DATE_ADD(o.create_on,INTERVAL 1 DAY)))
        or (order_status = 'D' and o.declined_datetime >  DATE_ADD(o.create_on,INTERVAL 1 DAY))) `;


        return db.query(sql,{replacements:{chef_id:chef_id},type:db.QueryTypes.SELECT}).then(resp => {
                if (resp && resp.length > 0) {
                    let response_rate = null;
                    return db.query(missReponseCntSql,{replacements:{chef_id:chef_id},type:db.QueryTypes.SELECT}).then(result => {
                        let forgiveCnt = 3;
                        let activeMissCnt = 0;
                        if (result && result.length > 0) {
                            forgiveCnt = forgiveCnt - result[0].missCnt;
                            // 当三次机会用完了之后，下单信息未反馈的数量将被计算到总信息数中
                            if (forgiveCnt < 0) {
                                forgiveCnt = 0;
                                activeMissCnt = forgiveCnt;
                            }
                        }

                        let replyCnt = resp[0].chefReplyCnt + forgiveCnt;
                        if (replyCnt < 0) {
                            replyCnt = 0;
                        }

                        if ((resp[0].chefReplyCnt + resp[0].custToChefMsgCnt) !== 0) {
                            let rate = replyCnt / (replyCnt+ resp[0].custToChefMsgCnt+activeMissCnt) ;
                            response_rate =  Math.round(rate*100) + '%';
                        }
                        return response_rate;
                    })
                }
        })

    }

    updateMenuIdWithNewMenuId(oldMenuId, new_menu_id,t) {
        return this.baseUpdate({menu_id:new_menu_id},{where:{menu_id:oldMenuId,active_ind:activeIndStatus.ACTIVE},transaction:t})
    }

    checkUpdateOrderGuestList(order_id, user_id) {
        return this.getOne({where:{order_id:order_id,user_id:user_id,active_ind:activeIndStatus.ACTIVE}}).then(order => {
            if (!order) {
                throw baseResult.INVALID_ORDER_ID
            }
            return order;
        })
    }

    checkEventDate(order_id, user_id) {
        return this.checkUpdateOrderGuestList(order_id,user_id).then(order =>{

            return chefMenuService.getOneByMenuId(order.menu_id).then(menu => {
                if (!menu) {
                    throw 'no active menu! order id:'+order_id ;
                }
                if (!moment().add(menu.preparation_days?menu.preparation_days:0, 'days').isBefore(moment(order.event_date))){
                    throw baseResult.ORDER_SECTION_GUEST_LIST_INVALID;
                }
                return order;
            })
        })

    }
}
// module.exports = new OrderService()
export default new OrderService()
