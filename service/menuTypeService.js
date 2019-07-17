import BaseService from './baseService.js'
import {AutoWritedMenuType} from '../common/AutoWrite.js'

@AutoWritedMenuType
class MenuTypeService extends BaseService{
    constructor(){
        super(MenuTypeService.model)
    }
}
module.exports = new MenuTypeService()