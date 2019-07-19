import BaseService from './baseService.js'
import {AutoWritedProvince} from '../common/AutoWrite.js'

@AutoWritedProvince
class ProvinceService extends BaseService{
    constructor(){
        super(ProvinceService.model)
    }
}
module.exports = new ProvinceService()