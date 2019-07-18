import BaseService from './baseService.js'
import {AutoWritedChefModel} from '../common/AutoWrite.js'

@AutoWritedChefModel
class ChefService extends BaseService{
    constructor(){
        super(ChefService.model)
    }
    getChefList(attr) {
        return ChefService.model.getChefList(attr)
    }
}
module.exports = new ChefService()