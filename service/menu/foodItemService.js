import BaseService from '../baseService.js'
import {AutoWritedFoodItem} from '../../common/AutoWrite.js'
import Sequelize from 'sequelize'
import activeIndStatus from "../../model/activeIndStatus";
import db from "../../config/db";
import chefService from '../chefService'
import baseResult from "../../model/baseResult";
const Op = Sequelize.Op
@AutoWritedFoodItem
class FoodItemService extends BaseService{
    constructor(){
        super(FoodItemService.model)
    }

    getChefMenuFoodItemsByChefId(chef_id) {
        let fields = ['food_item_id','food_item_name','food_item_desc','photo_url'];
        return this.baseFindByFilter(fields,{chef_id:chef_id,act_ind:activeIndStatus.ACTIVE}).then( foodItems => {
            let result = {};
            result.chef_id = chef_id;
            result.foodItem_list = foodItems;
            return result;
        })
    }

    /**
     *
     * @param attr  {{
          "chef_id": 0,
          "food_item_name": "string",
          "food_item_desc": "string",
          "photo_url": "string"
        }}
     */
    addChefMenuFoodItem(attr) {
        return db.transaction(t=> {
            return this.getModel().count({where:{food_item_name:attr.food_item_name,act_ind:activeIndStatus.ACTIVE},transaction:t}).then( itemCnt => {
                if (itemCnt >0) {
                    throw baseResult.MENU_FOOD_ITEM_NAME_EXIST;
                }
                return this.baseCreate(attr,{transaction:t});
            })
        })
    }


    editChefMenuFoodItem(attr) {
        return db.transaction(t => {
            return this.getModel().count({where:{food_item_name:attr.food_item_name,act_ind:activeIndStatus.ACTIVE},transaction:t}).then( nameCnt => {
                if (nameCnt >0) {
                    throw baseResult.MENU_FOOD_ITEM_NAME_EXIST;
                }
                return this.getOne({where:{chef_id:attr.chef_id,food_item_id:attr.food_item_id,act_ind:activeIndStatus.ACTIVE}}).then(foodItem => {
                    if (foodItem) {
                        return this.baseUpdate(attr,{where:{food_item_id:attr.food_item_id,chef_id:attr.chef_id},transaction:t});

                    } else {
                        throw baseResult.MENU_FOOD_ITEM_ID_NOT_BELONG_TO_CHEF;
                    }
                })
            })
        })
    }
    
    /**
     *  attr 中包含chef_id ,food_item_id
     * @param attr
     */
    removeChefMenuFoodItem(attr) {
         return this.getOne({where:{chef_id:attr.chef_id,food_item_id:attr.food_item_id,act_ind:activeIndStatus.ACTIVE}}).then(foodItem => {
            if (foodItem) {

                return this.baseUpdate({act_ind:activeIndStatus.INACTIVE},{where:{food_item_id:attr.food_item_id,chef_id:attr.chef_id},transaction:t});

            } else {
                throw baseResult.MENU_FOOD_ITEM_ID_NOT_BELONG_TO_CHEF;
            }
        })
    }
    
}
module.exports = new FoodItemService()