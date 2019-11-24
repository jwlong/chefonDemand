import BaseService from './baseService.js'
import {AutoWritedOrderItemOption} from '../common/AutoWrite.js'
import db from "../config/db";

@AutoWritedOrderItemOption
class OrderItemOptionService extends BaseService {
    constructor() {
        super(OrderItemOptionService.model)
    }
}
module.exports = new OrderItemOptionService()