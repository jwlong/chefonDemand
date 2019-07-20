import BaseService from './baseService.js'
import countryService from  './countryService'
import provinceService from './provinceService'
import areaService from './areaService'
import cityService from './cityService'
import townService from './townService'
import cuisineTypeService from './cuisineTypeService'
import languageService from './languageService'
import chefLanguageService from './chefLanguageService'
import districtService from './districtService'
import menuTypeService from './menuTypeService'
import chefMenuService from './chefMenuService'
import cityDistrictService from './cityDistrictService'

class SystemService extends BaseService{
    constructor(){
        super()
    }
    obtainAccessToken(req) {
       // grant type, client id, client secret
    }
}
module.exports = new SystemService()