import BaseService from './baseService.js'
import {AutoWritedTown} from '../common/AutoWrite.js'

@AutoWritedTown
class TownService extends BaseService{
    constructor(){
        super(TownService.model)
    }
}
module.exports = new TownService()