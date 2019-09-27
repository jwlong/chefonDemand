import BaseService from '../baseService.js'
import {AutoWritedMenuInclude} from '../../common/AutoWrite.js'
import Sequelize from 'sequelize'
@AutoWritedMenuInclude
class MenuIncludeService extends BaseService{
    constructor(){
        super(MenuIncludeService.model)
    }

    copyMenuInclude(menu_id,new_menu_id,t) {
        return this.getModel().findAll({where:menu_id}).then(includeList => {
            let copyIncludeList = [];
            includeList.forEach(inc => {
                 inc.menu_id = new_menu_id;
                 copyIncludeList.push(inc);
            })
            return this.baseCreateBatch(copyIncludeList,{transaction:t});
        })
    }

}

module.exports = new MenuIncludeService()