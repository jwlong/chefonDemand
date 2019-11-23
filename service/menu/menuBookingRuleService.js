import BaseService from '../baseService.js'
import {AutoWritedMenuBookingRule} from '../../common/AutoWrite.js'
import Sequelize from 'sequelize'
import activeIndStatus from "../../model/activeIndStatus";
import chefMenuService from "../chefMenuService";
const Op = Sequelize.Op
@AutoWritedMenuBookingRule
class MenuBookingRuleService extends BaseService{
    constructor(){
        super(MenuBookingRuleService.model)
    }

    copyBookRule(last_menu_id, new_menu_id, t) {
        return this.getModel().findAll({where:{menu_id:last_menu_id}}).then(list => {
            let copyList = [];
            list.forEach(bookRule => {
                bookRule.menu_id = new_menu_id;
                copyList.push(bookRule);
            })
            return this.baseCreateBatch(copyList,{transaction:t});
        })
    }

    updateBookingRuleDirectly(status, last_menu_id, new_menu_id, attrs, t) {
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
module.exports = new MenuBookingRuleService()