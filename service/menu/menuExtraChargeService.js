import BaseService from '../baseService.js'
import {AutoWritedmenuExtraCharge} from '../../common/AutoWrite.js'
import Sequelize from 'sequelize'
import activeIndStatus from "../../model/activeIndStatus";
import db from "../../config/db";
const Op = Sequelize.Op
@AutoWritedmenuExtraCharge
class MenuExtraCharge extends BaseService{
    constructor(){
        super(MenuExtraCharge.model)
    }

    copyExtraCharge(last_menu_id, new_menu_id, t) {

    }
}
module.exports = new MenuExtraCharge()