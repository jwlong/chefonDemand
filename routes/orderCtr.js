/**
 */
import express from 'express'
import userService from '../service/userService';
import chefMenuService from '../service/chefMenuService'
import orderService from '../service/orderService';
import orderGuestService  from '../service/orderGuestService'
import baseResult from "../model/baseResult";
import chefService from '../service/chefService'
import moment from 'moment'

const router = express.Router()
// 请求前缀为/order/
class OrderController {
    static initRouter(){
        // func#55: /order/createOrderByMenuId
        router.post('/createOrderByMenuId',async(req,res,next) =>{
            try {
                let createOrderRequest = req.body;
                let user = await  userService.getById(req.user_id)
                if (!user) {
                    throw baseResult.ORDER_USER_INVALID;
                }
                if (!createOrderRequest || !createOrderRequest.menu_id)  {
                    throw 'CreateOrderRequest is required!';
                }
                let menu_id = createOrderRequest.menu_id;
                let menu = await  chefMenuService.checkMenuCanCreateOrder(createOrderRequest);
                createOrderRequest.user_name = user.user_name;
                createOrderRequest.user_id = req.user_id;
                let orderId = await orderService.createOrderByMenuId(createOrderRequest);
                res.json({order_id:orderId})
            }catch (e){
                next(e);
            }
        })
        // func#56: /order/updateOrderGuestListByOrderId
        router.post('/updateOrderGuestListByOrderId',async(req,res,next) =>{
            try {
                let updateOrderGuestList = req.body;
                let user = await userService.getById(req.user_id)
                if (!user) {
                    throw baseResult.ORDER_USER_ONLY_ACTIVE_GUEST;
                }
                if (!updateOrderGuestList || !updateOrderGuestList.order_id)  {
                    throw 'UpdateOrderGuestList is required!';
                }

                let order = await orderService.checkEventDate(updateOrderGuestList.order_id,user.user_id);

                updateOrderGuestList.num_of_guest  = order.num_of_guest ?order.num_of_guest:0;

                await orderGuestService.updateOrderGuestListByOrderId(updateOrderGuestList);
                res.json(baseResult.SUCCESS)
            }catch (e){
                next(e);
            }
        })

        //func#57: /order/updateOrderGuestSelectionByOrderId
        router.post('/updateOrderGuestSelectionByOrderId',async(req,res,next) =>{
            try {
                if (!req.user_id) {
                    throw baseResult.ORDER_SECTION_USER_ONLY_ACTIVE_GUEST;
                }
                let attrs  = req.body;
                let verityUnique = (attrs.order_id)+'' +attrs.unique_id;

                if (!attrs || !attrs.order_id)  {
                    throw 'UpdateOrderGuestList is required!';
                }
                let unique_id_str = String(attrs.unique_id);
                let orderGuestStrArr = unique_id_str.split(attrs.order_id);
                if (orderGuestStrArr && orderGuestStrArr.length > 1) {
                    attrs.order_guest_id = orderGuestStrArr[1];
                }
                //let menu = await  chefMenuService.getOneByMenuId(attrs.menu_id);
                console.log("order_id,order_guest_id",attrs.order_id,attrs.order_guest_id)
                if (!attrs.order_guest_id) {
                    throw 'unique_id is invalid!'
                }
                let order = await  orderService.getOneByOrderId(attrs.order_id);

                if (!order) {
                    throw 'order is not exist! order_id:'+attrs.order_id
                }

                let menu = await  chefMenuService.getOneByMenuId(order.menu_id);

                if (!menu || !order) {
                    throw baseResult.ORDER_SECTION_GUEST_LIST_INVALID;
                }
                if (!moment().add(menu.preparation_days?menu.preparation_days:0, 'days').isBefore(moment(order.event_date))){
                    throw baseResult.ORDER_SECTION_GUEST_LIST_INVALID;
                }

                await orderGuestService.updateOrderGuestSelectionByOrderId(attrs,menu);
                res.json(baseResult.SUCCESS)
            }catch (e){
                next(e);
            }
        })

        // func#58: /order/cancelOrderByOrderId

        router.post('/cancelOrderByOrderId',async(req,res,next) =>{
            try {
                let attrs  = req.body;
                if (!attrs || !attrs.order_id)  {
                    throw 'CancelOrderRequest is required!';
                }
                let user = await  userService.getById(req.user_id)
                if (!user) {
                    throw baseResult.ORDER_ONLY_ACTIVE_USER_CANCEL;
                }
                let order = await  orderService.getOneByOrderId(attrs.order_id);

                if (!order) {
                    throw 'order is not exist! order_id:'+attrs.order_id
                }
                attrs.user_id = user.user_id;
                await orderService.cancelOrderByOrderId(attrs);
                res.json(baseResult.SUCCESS)
            }catch (e){
                next(e);
            }
        })

        // (Func59) Get active orders /order​/getOrdersByUserId
        router.get('/getOrdersByUserId',async(req,res,next) =>{
            try {
                let attrs = {};
                let user = await  userService.getById(req.user_id);
                if (!user) {
                    throw baseResult.ORDER_ONLY_CHEF_AND_USER_CAN_VIEW
                }
                let chefUser = await chefService.getChefByUserId(user.user_id);
                attrs.user_id = user.user_id;
                if (chefUser) {
                    attrs.chef_id = chefUser.chef_id;
                }
                let result = {};
                result.order_list = await orderService.getOrdersByUserId(attrs);
                res.json(result);
            }catch (e) {
                next(e);
            }
        })
        //func 61 order/getOrderStatisticsByChefId

        router.get('/getOrderStatisticsByChefId',async(req,res,next) =>{
            try {
                let chefUser = await  chefService.getChefByUserId(req.user_id);
                if (!chefUser) {
                    throw baseResult.MENU_ONLY_CHEF_CAN_DO_THIS;
                }
                let result = await  orderService.getOrderStatisticsByChefId(chefUser.chef_id);
                if (result) {
                    result.response_rate = await  orderService.getResponseRate(chefUser.chef_id);
                }
                res.json(result);
            }catch (e) {
                next(e);
            }
        })


        return router;
    }
}
module.exports = OrderController.initRouter();