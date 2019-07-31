import BaseService from './baseService.js'
import countryService from  './countryService'
import chefService from  './chefService'
import provinceService from './provinceService'
import cityService from './cityService'
import languageService from './languageService'
import chefLanguageService from './chefLanguageService'
import districtService from './districtService'
import chefMenuService from './chefMenuService'
import cuisineTypeService from './cuisineTypeService'

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

}
module.exports = new SystemService()