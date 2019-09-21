import BaseService from '../baseService.js'
import {AutoWritedMenuBookingReq} from '../../common/AutoWrite.js'
import Sequelize from 'sequelize'
import activeIndStatus from "../../model/activeIndStatus";
import db from "../../config/db";
const Op = Sequelize.Op
@AutoWritedMenuBookingReq
class MenuBookingRequirementService extends BaseService{
    constructor(){
        super(MenuBookingRequirementService.model)
    }

    getMenuBookingRequirement(menu_id) {
        let fields = ['booking_requirement_id','booking_requirement_desc'];
        return this.baseFindByFilter(fields,{menu_id:menu_id,active_ind:activeIndStatus.ACTIVE}).then( reqs => {
            let result = {};
            result.menu_id = menu_id;
            result.booking_req_list = reqs;
            return result;
        })
    }
}
module.exports = new MenuBookingRequirementService()