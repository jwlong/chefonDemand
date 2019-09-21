import BaseService from '../baseService.js'
import {AutoWritedMenuInclude} from '../../common/AutoWrite.js'
import Sequelize from 'sequelize'
@AutoWritedMenuInclude
class MenuIncludeService extends BaseService{
    constructor(){
        super(MenuIncludeService.model)
    }
}

module.exports = new MenuIncludeService()