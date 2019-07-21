import BaseService from './baseService.js'
import {AutoWritedMenuDetails} from '../common/AutoWrite.js'

@AutoWritedMenuDetails
class MenuDetailsService extends BaseService{
    constructor(){
        super(MenuDetailsService.model)
    }
}
module.exports = new MenuDetailsService()