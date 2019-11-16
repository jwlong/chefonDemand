import BaseService from './baseService.js'
import {AutoWritedUserRate} from '../common/AutoWrite.js'

@AutoWritedUserRate
class UserRateService extends BaseService{

    constructor(){
        super(UserRateService.model)
    }
}
module.exports = new UserRateService()