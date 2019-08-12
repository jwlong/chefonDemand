import BaseService from './baseService.js'
import {AutoWritedAccessToken} from '../common/AutoWrite.js'

@AutoWritedAccessToken
class AccessTokenService extends BaseService{
    constructor(){
        super(AccessTokenService.model)
    }
}
module.exports = new AccessTokenService