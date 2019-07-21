import BaseService from './baseService.js'
import countryService from  './countryService'
import chefService from  './chefService'
import provinceService from './provinceService'
import areaService from './areaService'
import cityService from './cityService'
import townService from './townService'
import languageService from './languageService'
import chefLanguageService from './chefLanguageService'
import districtService from './districtService'
import menuTypeService from './menuTypeService'
import chefMenuService from './chefMenuService'
import cityDistrictService from './cityDistrictService'
import chefDistrictService from  './chefDistrictService'
import menuDetailsService from  './menuDetailsService'
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
        return areaService.baseCreateBatch(req);
    }
    chefCreateBatch(req) {
        return chefService .baseCreateBatch(req);
    }

}
module.exports = new SystemService()