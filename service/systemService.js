import BaseService from './baseService.js'
import countryService from  './countryService'
import chefService from  './chefService'
import cityService from './cityService'
import languageService from './languageService'
import chefLanguageService from './chefLanguageService'
import districtService from './districtService'
import chefMenuService from './chefMenuService'
import cuisineTypeService from './cuisineTypeService'
import userService from './userService'
class SystemService extends BaseService{
    constructor(){
        super()
    }
    cuisineTypeCreateBatch(req) {
        return cuisineTypeService.baseCreateBatch(req);
    }
    cityCreateBatch(req) {
        return cityService.baseCreateBatch(req);
    }
    areaCreateBatch(req) {
       return "";
    }
    chefCreateBatch(req) {
        return chefService .baseCreateBatch(req);
    }

    // create user
    userCreate(req) {
        return userService.baseCreate(req);
    }
    getUser(req) {
        return userService.findByFilter(req);
    }

}
module.exports = new SystemService()