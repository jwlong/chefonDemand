import BaseService from './baseService.js'
import {AutoWritedArea} from '../common/AutoWrite.js'

@AutoWritedArea
class AreaService extends BaseService{
    constructor(){
        super(AreaService.model)
    }
}
module.exports = new AreaService()