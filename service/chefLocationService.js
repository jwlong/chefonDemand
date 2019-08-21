import BaseService from './baseService.js'
import {AutoWritedChefLocation} from '../common/AutoWrite.js'
import baseResult from '../model/baseResult'
@AutoWritedChefLocation
class ChefLocationService extends BaseService{
    constructor(){
        super(ChefLocationService.model)
    }
}
module.exports = new ChefLocationService()