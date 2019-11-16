import BaseService from './baseService.js'
import {AutoWritedOrder} from '../common/AutoWrite.js'

@AutoWritedOrder
class OrderService extends BaseService{
    constructor(){
        super(OrderService.model)
    }
}
module.exports = new OrderService()