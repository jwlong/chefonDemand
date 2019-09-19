import BaseService from './baseService.js'
import {AutoWritedMenuItem} from '../common/AutoWrite.js'

@AutoWritedMenuItem
class MenuItemService extends BaseService{
    constructor(){
        super(MenuItemService.model)
    }
}
module.exports = new MenuItemService()