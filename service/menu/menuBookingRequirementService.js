import BaseService from '../baseService.js'
import {AutoWritedMenuBookingReq} from '../../common/AutoWrite.js'
import Sequelize from 'sequelize'
import activeIndStatus from "../../model/activeIndStatus";
import db from "../../config/db";
import chefMenuService from "../chefMenuService";
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

    updateBookingRequirementDirectly(status, last_menu_id, new_menu_id, attrs, t) {
        return chefMenuService.baseUpdate({active_ind:activeIndStatus.REPLACE,public_ind:0},{where:{menu_id:last_menu_id,active_ind:activeIndStatus.ACTIVE},transaction:t}).then(updatedMenu => {
            let promiseArr = [];
            let newList = [];
            let p1 = this.baseUpdate({active_ind:status},{where:{menu_id:last_menu_id,active_ind:activeIndStatus.ACTIVE},transaction:t});
            promiseArr.push(p1);
            attrs.forEach(item => {
                item.menu_id = new_menu_id;
                newList.push(item);
            })
            promiseArr.push(this.baseCreateBatch(newList,{transaction:t}));
            return Promise.all(promiseArr);
        })
    }
}
module.exports = new MenuBookingRequirementService()