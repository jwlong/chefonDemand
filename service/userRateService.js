import BaseService from './baseService.js'
import {AutoWritedUserRate} from '../common/AutoWrite.js'
import db from "../config/db";
import baseResult from "../model/baseResult";
@AutoWritedUserRate
class UserRateService extends BaseService{

    constructor(){
        super(UserRateService.model)
    }

    /**
     * attrs as   {
          "menu_id": 0,
          "user_id": 0,
          "order_id": 0,
          "menu_quality": 0,
          "service_quality": 0,
          "mastery_flavour_cooking_techniques": 0,
          "personality_of_chef_in_cuisine": 0,
          "hygene": 0,
          "value_for_money": 0,
          "remarks_html": "string"
        }
     * @param attrs
     */
    addMenuReviewsByMenuId(attrs){
        let sql = `SELECT
          o.menu_id,
          o.order_id
        FROM t_order o
          LEFT JOIN t_chef_menu m ON m.menu_id = o.menu_id AND m.active_ind = 'A'
        WHERE m.menu_id = :menu_id AND o.active_ind = 'A' AND order_id = :order_id`;

        let ratingSql = `SELECT
          avg(rating.overall_rating)              overall_rating,
          avg(rating.menu_quality)                menu_quality,
          avg(service_quality)                    service_quality,
          avg(mastery_flavour_cooking_techniques) mastery_flavour_cooking_techniques,
          avg(personality_of_chef_in_cuisine)     personality_of_chef_in_cuisine,
          avg(hygene)                             hygene,
          avg(value_for_money)                    value_for_money
        FROM t_user_rating rating
          LEFT JOIN t_order o ON rating.order_id = o.order_id AND o.active_ind = 'A'
          LEFT JOIN t_chef_menu m ON m.menu_id = o.menu_id AND m.active_ind = 'A'
        WHERE m.menu_id = :menu_id AND rating.active_ind = 'A'
        GROUP BY m.menu_id`;
        return db.transaction(t=> {
            //transaction:trans
            return db.query(sql,{replacements:{menu_id:attrs.menu_id,order_id:attrs.order_id},
                type:db.QueryTypes.SELECT ,transaction:t}).then(resp => {
                    if (resp) {
                        return db.query(ratingSql,{replacements:{menu_id:attrs.menu_id},type:db.QueryTypes.SELECT,transaction:t}).then(
                            avgResult => {
                                let newRating = avgResult.toJSON();
                                Object.assign(newRating,attrs);
                                return this.baseCreate(newRating,{transaction:t});
                            }
                        )
                    }else{
                        throw baseResult.MENU_CAN_OLNY_ADD_ACTIVE_MENU;
                    }
            })
        })
    }

}
module.exports = new UserRateService()