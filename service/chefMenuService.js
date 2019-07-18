import BaseService from './baseService.js'
import {AutoWritedChefMenu} from '../common/AutoWrite.js'

@AutoWritedChefMenu
class ChefMenuService extends BaseService{
    constructor(){
        super(ChefMenuService.model)
    }
}
module.exports = new ChefMenuService()