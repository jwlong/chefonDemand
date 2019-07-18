import BaseService from './baseService.js'
const jwt = require('jsonwebtoken');
class SystemService extends BaseService{
    constructor(){
        super()
    }
    obtainAccessToken(req) {
       // grant type, client id, client secret

    }
}
module.exports = new SystemService()