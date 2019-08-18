import BaseService from './baseService.js'
import {AutoWritedChefLanguage} from '../common/AutoWrite.js'
import chefService from './chefService'
import baseResult from "../model/baseResult";

@AutoWritedChefLanguage
class ChefLanguageService extends BaseService{
    constructor(){
        super(ChefLanguageService.model)
    }
    getChefLangByChefId(chefId) {
        return ChefLanguageService.model.getChefLangByChefId(chefId)
    }

    /**
     *
     * @param attr
             * {
          "chef_Id": 0,
          "language_list": [
            {
              "language_code": "string",
              "active_ind": true
            }
          ]
        }
     */
    setupChefLanguage(attr) {
        if (!attr.language_list || (attr.language_list && attr.language_list.length ==0) ){
            throw baseResult.CHEF_LANG_LIST_EMPTY;
        }
        return this.baseCreateBatch(attr.language_list);
    }
}
module.exports = new ChefLanguageService()