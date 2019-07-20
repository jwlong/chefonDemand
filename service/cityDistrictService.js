import BaseService from './baseService.js'
import {AutoWritedCityDistrict} from '../common/AutoWrite.js'
@AutoWritedCityDistrict
class CityDistrictService extends BaseService{
    constructor(){
        super(CityDistrictService.model)
    }
}
module.exports = new CityDistrictService()