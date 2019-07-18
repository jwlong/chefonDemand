import BaseService from './baseService.js'
import {AutoWritedLanguage} from '../common/AutoWrite.js'

@AutoWritedLanguage
class LanguageService extends BaseService{
    constructor(){
        super(LanguageService.model)
    }
}
module.exports = new LanguageService()