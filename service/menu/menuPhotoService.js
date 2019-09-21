import BaseService from '../baseService.js'
import {AutoWritedMenuPhoto} from '../../common/AutoWrite.js'
import Sequelize from 'sequelize'
import activeIndStatus from "../../model/activeIndStatus";
import db from "../../config/db";
const Op = Sequelize.Op
@AutoWritedMenuPhoto
class MenuPhotoService extends BaseService{
    constructor(){
        super(MenuPhotoService.model)
    }

    /**
     *
     * @param menu_id
     */
    getMenuPhotosByMenuId(menu_id) {
        let fields = ['photo_url','photo_desc','seq_no'];
        return this.baseFindByFilter(fields,{menu_id:menu_id,active_ind:activeIndStatus.ACTIVE}).then(photoList => {
            let result = {};
            result.menu_id = menu_id;
            result.photo_list = photoList;
            return result;
        })
    }
}
module.exports = new MenuPhotoService()