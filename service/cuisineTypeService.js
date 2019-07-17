import BaseService from './baseService.js'
import {AutoWritedCuisineType} from '../common/AutoWrite.js'

@AutoWritedCuisineType
class CuisineTypeService extends BaseService{
    constructor(){
        super(CuisineTypeService.model)
    }
}
module.exports = new CuisineTypeService()