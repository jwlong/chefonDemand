import BaseService from './baseService.js'
import {AutoWritedChefLanguage} from '../common/AutoWrite.js'

@AutoWritedChefLanguage
class ChefLanguageService extends BaseService{
    constructor(){
        super(ChefLanguageService.model)
    }
    getChefLangByChefId(attr) {
        return ChefLanguageService.model.getChefLangByChefId(attr)
    }
}
module.exports = new ChefLanguageService()