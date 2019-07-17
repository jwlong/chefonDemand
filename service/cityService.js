import BaseService from './baseService.js'
import {AutoWritedCityModel} from '../common/AutoWrite.js'
@AutoWritedCityModel
class CityService extends BaseService{
    constructor(){
        super(CityService.model)
    }
}
module.exports = new CityService()