import BaseService from './baseService.js'
import {AutoWritedUser} from '../common/AutoWrite.js'

@AutoWritedUser
class UserService extends BaseService{
    constructor(){
        super(UserService.model)
    }
}
module.exports = new UserService()