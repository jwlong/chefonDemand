import BaseService from './baseService.js'
import {AutoWritedChefDistrict} from '../common/AutoWrite.js'

@AutoWritedChefDistrict
class ChefDistrictService extends BaseService{
    constructor(){
        super(ChefDistrictService.model)
    }
}
module.exports = new ChefDistrictService()