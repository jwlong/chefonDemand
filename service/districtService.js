import BaseService from './baseService.js'
import {AutoWritedDistrict} from '../common/AutoWrite.js'

@AutoWritedDistrict
class DistrictService extends BaseService{
    constructor(){
        super(DistrictService.model)
    }
}
module.exports = new DistrictService()