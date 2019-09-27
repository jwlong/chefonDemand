import BaseService from '../baseService.js'
import {AutoWritedMenuBookingRule} from '../../common/AutoWrite.js'
import Sequelize from 'sequelize'
import activeIndStatus from "../../model/activeIndStatus";
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
}
module.exports = new MenuBookingRuleService()