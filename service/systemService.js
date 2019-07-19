import BaseService from './baseService.js'
import countryService from  './countryService'
import provinceService from './provinceService'
import areaService from './areaService'
import cityService from './cityService'


class SystemService extends BaseService{
    constructor(){
        super()
    }
    obtainAccessToken(req) {
       // grant type, client id, client secret

    }
}
module.exports = new SystemService()