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

    copyCuisineByMenuId(menu_id,newMenuId, t) {
        return this.getModel().findAll({where:{menu_id:menu_id},transaction:t}).then(cuisineList => {
                let copyCuisineList = [];
                cuisineList.forEach(cuisine => {
                    cuisine.menu_id = newMenuId;
                    copyCuisineList.push(cuisine);
                })
                return this.baseCreateBatch(copyCuisineList,{transaction:t});
        })
    }

    copyBookingReq(last_menu_id, new_menu_id, t) {


    }
}
module.exports = new MenuBookingRequirementService()