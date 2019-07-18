import BaseService from './baseService.js'
import {AutoWritedChefLanguage} from '../common/AutoWrite.js'

@AutoWritedChefLanguage
class ChefLanguageService extends BaseService{
    constructor(){
        super(ChefLanguageService.model)
    }
}
module.exports = new ChefLanguageService()