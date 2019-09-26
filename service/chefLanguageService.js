import BaseService from './baseService.js'
import {AutoWritedChefLanguage} from '../common/AutoWrite.js'
import languageService from './languageService'
import baseResult from "../model/baseResult";
import utils from "../common/utils";
import db from '../config/db'
import Sequelize from 'sequelize'
import activeIndStatus from "../model/activeIndStatus";
const Op = Sequelize.Op

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
        if (!attr.language_list || (Array.isArray(attr.language_list) && attr.language_list.length === 0) ){
            throw baseResult.CHEF_LANG_LIST_EMPTY;
        }

        return db.transaction(t=> {
            let promiseArr = [];
            let lang_codes = [];
            attr.language_list.forEach(chefLang => {
                if (chefLang) {
                    chefLang.chef_id = attr.chef_id;
                    chefLang.lang_code = chefLang.lang_code || chefLang.language_code;
                    lang_codes.push(chefLang.lang_code);

                    //utils.setCustomTransfer(chefLang,'create');
                   let p = languageService.getOne({where:{lang_code:chefLang.lang_code,active_ind:activeIndStatus.ACTIVE},transaction:t}).then(actCtn => {
                        if (actCtn <= 0) {
                            throw baseResult.CHEF_EXIST_INVALID_IN_LANG_LIST;
                        }

                        return this.getModel().count({where:{chef_id:chefLang.chef_id,lang_code:chefLang.lang_code},transaction:t}).then(cnt => {

                            if (cnt >0) {
                                return this.baseUpdate({active_ind:chefLang.active_ind},{where:{chef_id:chefLang.chef_id,lang_code:chefLang.lang_code},transaction:t});
                            } else {

                                return this.baseCreate(chefLang,{transaction:t});
                            }
                        })
                    })
                    promiseArr.push(p);
                }
            })
            if (lang_codes.length > 0) {
                let p2 = this.baseUpdate({active_ind:activeIndStatus.INACTIVE},{where:{chef_id:attr.chef_id,active_ind:activeIndStatus.ACTIVE,lang_code:{[Op.notIn]:lang_codes}},transaction:t})
                promiseArr.push(p2);
            }
            return Promise.all(promiseArr);
        })


        return this.baseCreateBatch(attr.language_list);
    }
}
module.exports = new ChefLanguageService()