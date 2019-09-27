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
}
module.exports = new MenuExtraCharge()