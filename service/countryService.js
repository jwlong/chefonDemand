import BaseService from './baseService.js'
import {AutoWritedCountry} from '../common/AutoWrite.js'

@AutoWritedCountry
class CountryService extends BaseService{
    constructor(){
        super(CountryService.model)
    }
}
module.exports = new CountryService()