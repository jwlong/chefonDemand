import BaseService from './baseService.js'
import {AutoWritedChefMenu} from '../common/AutoWrite.js'
import db from "../config/db";
import chefService from './chefService'
import activeIndStatus from "../model/activeIndStatus";
import menuItemService from './menu/menuItemService'
import menuItemOptionService from './menu/menuItemOptionService'
import menuCuisineService from './menu/menuCuisineService'
import kitchenReqService from './menu/kitchenReqService'
import menuIncludeService from './menu/menuIncludeService'
import menuChefNoteService from './menu/menuChefNoteService'
//t_menu_booking_rule
import menuBookingRuleService from './menu/menuBookingRuleService'
import menuBookingRequirementService from './menu/menuBookingRequirementService'
import menuExtraChargeService from './menu/menuExtraChargeService'
import menuPhotoService from './menu/menuPhotoService'
import orderService from './orderService'
import messageService from './messageService'
import moment from 'moment'
import baseResult from "../model/baseResult";
import msgCfg from '../common/messgeConf'
import userModel from '../model/user'
import Sequelize from 'sequelize'
import locationService from './chefLocationService'
import cloneExclude from "../common/cloneExclude";

const Op = Sequelize.Op
@AutoWritedChefMenu
class ChefMenuService extends BaseService{
    constructor(){
        super(ChefMenuService.model)
    }
    getOneByMenuId(menu_id) {
        return this.getOne({where:{menu_id:menu_id,active_ind:activeIndStatus.ACTIVE}})
    }
    getPublicIndStatusArr(user_id) {
        console.log("getPublicIndStatusArr userId:",user_id);
        if (!user_id) {
            return new Promise(resolve => {
                let result = [1]
                resolve(result)
            })
        }
        return chefService.getChefByUserId(user_id).then(
            chef => {
                let arr = [];
                console.log("chef =>",chef)
                if (chef) {
                    arr = [0,1];
                }else {
                    arr = [1];
                }
                return arr;
            }
        )
    }

    updateMenuByChefIdDirectly(chef_id,menu_id,attrs,t) {
        console.log("start to update menu by chef id",attrs);
        let promiseArr = [];
        attrs.active_ind = activeIndStatus.ACTIVE;
        // 直接修改chef menu
        // check menu_code
        let part1 =  this.baseUpdate(attrs,{where:{menu_id:menu_id,chef_id:chef_id},transaction:t});
        promiseArr.push(part1);
        let part2 = menuItemService.batchUpdateStatus(menu_id,activeIndStatus.DELETE,t).then(updatdItemList => {
                let deletePromise = [];
                updatdItemList.forEach(item => {
                    deletePromise.push(menuItemOptionService.batchUpdateStatus(item,activeIndStatus.DELETE,t));
                })
                return Promise.all(deletePromise);
            }
        )
        promiseArr.push(part2);
        return Promise.all(promiseArr).then(resp => {
            let promiseArr2 = [];
            attrs.menu_item_list.forEach(value => {
                value.menu_id = menu_id;
                let  pm = menuItemService.insertItem(value,t).then(item => {
                    value.menu_item_option_list.forEach(op =>{
                        op.menu_item_id = item.menu_item_id;
                        op.option_id = null;
                    })
                    return menuItemOptionService.batchInsertOptions(value.menu_item_option_list,t)
                })
                promiseArr2.push(pm);
            })
            return Promise.all(promiseArr2);
        });



    }


    updateMenuByChefId(chef_id,menu_id,attrs) {
        return db.transaction(t => {
            return this.getOne({where:{chef_id:chef_id,menu_id:menu_id,active_ind:activeIndStatus.ACTIVE},transaction:t}).then(chefMenu => {
                if (chefMenu) {
                    console.log("to updated menu ===>",chefMenu.toJSON());
                    if (chefMenu.public_ind === true) {
                        // If any existing outstanding orders (orders not yet performed) referencing this public menu_id
                        return orderService.getModel().findAll({where:{menu_id:menu_id,active_ind:activeIndStatus.ACTIVE,event_date:{[Op.gt]:moment()}},transaction:t}).then(orderList => {
                            if (orderList && orderList.length > 0) {
                                // clone menu

                                attrs.chef_id = chefMenu.chef_id;
                                let oldMenuId = chefMenu.menu_id;
                                //attrs.menu_code = chefMenu.chef_id+moment().format('YYYYMMDDHHmmSSSS')
                                attrs.menu_code = chefMenu.menu_code;
                                attrs.instant_ind = true;
                                attrs.menu_id = null;
                                attrs.parent_menu_id = oldMenuId
                                return this.baseCreate(attrs,{transaction:t}).then(resp => {
                                    // copy menu_item
                                    let promiseArr = [];
                                    console.log("update order menu_id:%s to new menu_id:%s",chefMenu.menu_id,resp.menu_id)
                                    promiseArr.push(orderService.updateMenuIdWithNewMenuId(chefMenu.menu_id,resp.menu_id,t));
                                    attrs.menu_item_list.forEach(value => {
                                        value.menu_id = resp.menu_id;
                                        // insert new menu_id
                                        value.menu_item_id = null;
                                        promiseArr.push(menuItemService.baseCreate(value,{transaction:t}).then(item => {
                                            item.menu_item_option_list = value.menu_item_option_list;
                                            return menuItemOptionService.batchInsert(item,t);
                                        }))
                                    })
                                    let p = this.baseUpdate({active_ind:activeIndStatus.REPLACE,public_ind:0},{where:{menu_id:menu_id,chef_id:chef_id},transaction:t}).then(updateCnt => {
                                        return messageService.insertMessageByOrderList(orderList,attrs,t);
                                    })

                                    promiseArr.push(this.oldMenuReferenceHandler(chefMenu.menu_id,null,t));
                                    promiseArr.push(p);
                                    return Promise.all(promiseArr);
                                })
                            }else {
                                return this.updateMenuByChefIdDirectly(chefMenu.chef_id,chefMenu.menu_id,attrs,t);
                            }
                        })
                    } else if (chefMenu.public_ind === false) {
                        //
                        return this.updateMenuByChefIdDirectly(chefMenu.chef_id,chefMenu.menu_id,attrs,t);
                    }
                }else {
                    throw baseResult.MENU_ID_NOT_EXIST;
                }
            })
        })


    }
    preparedChefMenu(attr) {
        //default value
        attr.public_ind = 0;
        attr.applied_meal = 3;
        attr.unit_price = 0.0000;
        attr.instant_ind = 1;
        attr.min_pers = 1;
        attr.event_duration_hr = 2.00;
        attr.chef_arrive_prior_hr = 1;
        attr.active_ind = activeIndStatus.ACTIVE;
        attr.menu_code =  attr.chef_id+moment().format('YYYYMMDDHHmmSSSS')
        if (!attr.menu_name || !attr.menu_desc) {
            throw baseResult.MENU_NAME_FIELD_MANDATORY;
        }
    }

    createMenuNameByChefId(attr) {
        this.preparedChefMenu(attr);
        return db.transaction(t => {
            return this.getModel().count({
                where: {chef_id: attr.chef_id, menu_name: attr.menu_name},
                transaction: t
            }).then(cnt => {
                if (cnt > 0) {
                    throw baseResult.MENU_NAME_EXISTS;
                }
                return this.nextId('seq_no', {transaction: t}).then(nextSeqNo => {
                    attr.seq_no = nextSeqNo;
                    return this.baseCreate(attr, {transaction: t})
                })
            })
        })
    }

    /**
     * criteria 默认包含menu_id属性
     * @param criteria
     * @returns {*}
     */
    getMenuWithoutItemsByCriteria(criteria) {
        return this.getOne({where:criteria});
    }
    getMenuByMenuId(criteria) {
        //no user id only can get public menu
        /* let attributes = ['chef_id','menu_id','menu_name',
             'menu_code','menu_desc','public_ind']*/
        // item options ['menu_item_id','seq_no','item_type_id','max_choice','note','optional']
        return this.getModel().findOne({where:criteria}).then(resp => {
            let result  = resp.toJSON();
            return menuItemService.baseFindByFilter(null,{menu_id:criteria.menu_id,active_ind:activeIndStatus.ACTIVE}).then(menuItems => {

                return menuItemOptionService.getMenuItemOptionsByMenuItems(menuItems).then(menuItemResult => {
                    result.menu_item_list = menuItemResult;
                    return result;
                })

            })
        });
    }

    /**
     * "chef_id": 0,
     "menu_id": 0,
     "menu_name": "string",
     "menu_code": "string",
     "menu_desc": "string",
     "public_ind": true,
     "seq_no": 0,
     "menu_rating": 0,
     "num_of_review": 0,
     "min_pers": 0,
     "max_pers": 0,
     "menu_logo_url": "string",
     "unit_price": 0,
     * @param chef_id
     */
    getMenuListByChefId(attrs) {
        let sql = `select m.chef_id, m.menu_desc,m.menu_id, m.menu_name, m.menu_code, m.public_ind, m.seq_no, m.min_pers, m.max_pers, m.menu_logo_url, m.unit_price,avg(rating.overall_rating) menu_rating ,count(rating.rating_id) num_of_review,min(m.unit_price) min_unit_price from chefondemand.t_chef_menu m left join chefondemand.t_order o on o.menu_id = m.menu_id and o.active_ind = 'A'
left join chefondemand.t_user_rating rating on o.order_id = rating.order_id and m.active_ind = 'A'
where m.active_ind = 'A' and m.chef_id = :chef_id and m.public_ind in (:publicIndArr) group by m.menu_id`;
        return db.query(sql,{replacements:attrs,type:db.QueryTypes.SELECT}).then(result => {
            return  locationService.getChefLocationDetail(attrs.chef_id).then(districtList => {
                let menuList = {};
                if (result) {
                    result.forEach(singleMenu => {
                        singleMenu.public_ind = singleMenu.public_ind.readUInt8(0);
                        singleMenu.chef_service_locations = districtList;
                    })
                }
                menuList.menu_list = result;
                return menuList;
            })
        });
    }
    /**
     * {
  "menu_id": 0,
  "applied_meal": 1,
  "min_pers": 0,
  "max_pers": 0,
  "event_duration_hr": 0,
  "chef_arrive_prior_hr": 0,
  "child_menu_note": "string"
}
     * @param criteria
     */
    getMenuServingDetailByMenuId(criteria) {
        let fileds = ['menu_id','applied_meal','min_pers','max_pers','event_duration_hr','chef_arrive_prior_hr','child_menu_note'];
        return this.getOne({attributes:fileds,where:criteria});
    }

    /**
     * check user_id ,menu_id是否合法，合法返回menu_id下的 查询条件数据
     * @param user_id
     * @param menu_id
     * @returns {PromiseLike<T> | Promise<T>}
     */
    checkUserIdAndMenuId(user_id, menu_id) {
        if (!menu_id) {
            throw baseResult.MENU_ID_FILED_MANDATORY;
        }
        return chefService.preparedMenuQueryCriteria(user_id,menu_id).then( criteria => {
                return this.getMenuWithoutItemsByCriteria(criteria).then(menu => {
                    if (!menu) throw baseResult.MENU_ID_NOT_EXIST;
                    else
                        return criteria;
                });
            }
        );
    }

    /**
     *
     * @param criteria 默认包含menu_id
     * @returns {*}
     */
    getMenuAboutByMenuId(criteria) {
        let fields = ['menu_id','about'];
        return this.getOne({attributes:fields,where:criteria});
    }

    cloneMenu(user_id, menu_id) {
        return chefService.getChefByUserId(user_id).then(chef => {
            if (chef){
                return this.getMenuWithoutItemsByCriteria({chef_id:chef.chef_id,menu_id:menu_id,active_ind:activeIndStatus.ACTIVE}).then(menu => {
                    if (!menu) throw baseResult.MENU_MENUID_NOT_BELONG_TO_CHEF;
                    console.log("clone menu:=============>",menu.toJSON());
                    return this.cloneProcess(menu.toJSON());
                })
            } else {
                throw baseResult.MENU_ONLY_CHEF_CAN_CREATE_MENU;
            }
        })
    }

    getMenuCancelPolicy(criteria) {
        let fields = ['menu_id','cancel_policy'];
        return this.getOne({attributes:fields,where:criteria});
    }

    cloneProcess(menu) {
        // first query
        return db.transaction(t => {
            // create new menu
            let last_menu_id = menu.menu_id;
            menu.menu_id = null;
            menu.menu_code = menu.chef_id+moment().format('YYYYMMDDHHmmSSSS')
            return this.baseCreate(menu,{transaction:t}).then(newMenu => {
                console.log("new menu============>",newMenu.toJSON());
                let new_menu_id = newMenu.menu_id;

                // copy t_menu_item
                return  menuItemService.getModel().findAll({where:{menu_id:last_menu_id},transaction:t}).then(items => {            let promiseArr = [];
                    items.forEach((item,index) => {
                        let createItemPromise = menuItemService.nextId('seq_no',{transaction:t}).then(nextSeqNo => {
                            let last_item_id = item.menu_item_id;
                            let oldItem = item.toJSON();
                            oldItem.seq_no = nextSeqNo+index;
                            oldItem.menu_id = new_menu_id;
                            oldItem.active_ind = activeIndStatus.ACTIVE;
                            oldItem.menu_item_id = null;
                            console.log("menu item =================>",oldItem);
                            return menuItemService.baseCreate(oldItem,{transaction:t}).then( resp => {
                                console.log("last_item_id=================>",last_item_id);
                                return menuItemOptionService.copyOptionsByItemId(last_item_id,resp.menu_item_id,t);
                            });
                        })
                        promiseArr.push(createItemPromise);
                    })
                    return Promise.all(promiseArr).then(result=> {
                        let otherPromiseArr = [];
                        //t_menu_cuisine
                        otherPromiseArr.push(this.copy(menuCuisineService,last_menu_id,new_menu_id,null,t));
                        // copy t_menu_kitchen_req
                        otherPromiseArr.push(this.copy(kitchenReqService,last_menu_id,new_menu_id,null,t));
                        // copy t_menu_include
                        otherPromiseArr.push(this.copy(menuIncludeService,last_menu_id,new_menu_id,null,t));
                        // copy t_menu_chef_note
                        otherPromiseArr.push(this.copy(menuChefNoteService,last_menu_id,new_menu_id,'menu_chef_note_id',t));
                        //copy t_menu_booking_rule
                        otherPromiseArr.push(this.copy(menuBookingRuleService,last_menu_id,new_menu_id,'booking_rule_id',t));
                        //copy t_menu_booking_requirement
                        otherPromiseArr.push(this.copy(menuBookingRequirementService,last_menu_id,new_menu_id,'booking_requirement_id',t));
                        // copy t_menu_extra_charge
                        otherPromiseArr.push(this.copy(menuExtraChargeService,last_menu_id,new_menu_id,'extra_charge_id',t));
                        // copy  t_menu_photo
                        otherPromiseArr.push(this.copy(menuPhotoService,last_menu_id,new_menu_id,'photo_id',t));
                        return Promise.all(otherPromiseArr);
                    });


                });
            })
        })
    }

    /**
     * chefMenu
     * @param menu
     * @param t
     * @returns {PromiseLike<T> | Promise<T>}
     */
    cloneNewLogic(menu,t,notCloneTypes,dataMapByNotCloneTypes) {
        // create new menu
        let last_menu_id = menu.menu_id;
        menu.menu_code =  menu.chef_id+moment().format('YYYYMMDDHHmmSSSS');
        if (!notCloneTypes) {
            notCloneTypes = [];
        }
        if (!dataMapByNotCloneTypes) {
            dataMapByNotCloneTypes = new Map();
        }
        menu.menu_id = null;

        //menu.menu_code = menu.menu_code
        console.log("clone menu=========>",menu)
        menu.public_ind = true;
        return this.baseCreate(menu,{transaction:t}).then(newMenu => {
            console.log("new menu============>",newMenu.toJSON());
            let new_menu_id = newMenu.menu_id;
            // update order to new menu_id
            return orderService.updateMenuIdWithNewMenuId(last_menu_id,new_menu_id,t).then(
                orderCnt => {
                    // copy t_menu_item
                    return  menuItemService.getModel().findAll({where:{menu_id:last_menu_id},transaction:t}).then(items => {            let promiseArr = [];
                        items.forEach((item,index) => {
                            let createItemPromise = menuItemService.nextId('seq_no',{transaction:t}).then(nextSeqNo => {
                                let last_item_id = item.menu_item_id;
                                let oldItem = item.toJSON();
                                oldItem.seq_no = nextSeqNo+index;
                                oldItem.menu_id = new_menu_id;
                                oldItem.active_ind = activeIndStatus.ACTIVE;
                                oldItem.menu_item_id = null;
                                console.log("menu item =================>",oldItem);
                                return menuItemService.baseCreate(oldItem,{transaction:t}).then( resp => {
                                    console.log("last_item_id=================>",last_item_id);
                                    return menuItemOptionService.copyOptionsByItemId(last_item_id,resp.menu_item_id,t);
                                });
                            })
                            promiseArr.push(createItemPromise);
                        })
                        return Promise.all(promiseArr).then(result=> {
                            let otherPromiseArr = [];
                            //t_menu_cuisine
                            if (notCloneTypes.indexOf(cloneExclude.menuCuisine) == -1) {
                                otherPromiseArr.push(this.copy(menuCuisineService,last_menu_id,new_menu_id,null,t));
                            }
                            if (notCloneTypes.indexOf(cloneExclude.kitchenReq) == -1) {
                                // copy t_menu_kitchen_req
                                otherPromiseArr.push(this.copy(kitchenReqService,last_menu_id,new_menu_id,null,t));
                            }else{
                                otherPromiseArr.push(kitchenReqService.updateDirectly(activeIndStatus.REPLACE,last_menu_id,new_menu_id,dataMapByNotCloneTypes.get(cloneExclude.kitchenReq),t));
                            }

                            if (notCloneTypes.indexOf(cloneExclude.menuInclude) == -1) {
                                // copy t_menu_include
                                otherPromiseArr.push(this.copy(menuIncludeService,last_menu_id,new_menu_id,null,t));
                            }else {
                                otherPromiseArr.push(menuIncludeService.updateDirectly(activeIndStatus.REPLACE,last_menu_id,new_menu_id,dataMapByNotCloneTypes.get(cloneExclude.menuInclude),t))
                            }
                            if (notCloneTypes.indexOf(cloneExclude.menuChefNote) == -1) {
                                // copy t_menu_chef_note
                                otherPromiseArr.push(this.copy(menuChefNoteService,last_menu_id,new_menu_id,'menu_chef_note_id',t));
                            }else {
                                console.log("when copy t_menu_chef_note,new menu_id",new_menu_id);
                                otherPromiseArr.push(menuChefNoteService.updateDirectly(activeIndStatus.REPLACE,last_menu_id,new_menu_id,dataMapByNotCloneTypes.get(cloneExclude.menuChefNote),t,false))
                            }
                            if (notCloneTypes.indexOf(cloneExclude.menuBookingRule) == -1) {
                                //copy t_menu_booking_rule
                                otherPromiseArr.push(this.copy(menuBookingRuleService,last_menu_id,new_menu_id,'booking_rule_id',t));
                            }else {
                                otherPromiseArr.push(menuBookingRuleService.updateDirectly(activeIndStatus.REPLACE,last_menu_id,new_menu_id,dataMapByNotCloneTypes.get(cloneExclude.menuBookingRule),t))
                            }
                            if (notCloneTypes.indexOf(cloneExclude.menuBookingRequirement) == -1) {
                                //copy t_menu_booking_requirement
                                otherPromiseArr.push(this.copy(menuBookingRequirementService,last_menu_id,new_menu_id,'booking_requirement_id',t));
                            }else{
                                otherPromiseArr.push(menuBookingRequirementService.updateDirectly(activeIndStatus.DELETE,last_menu_id,new_menu_id,dataMapByNotCloneTypes.get(cloneExclude.menuBookingRule),t))
                            }
                            if (notCloneTypes.indexOf(cloneExclude.menuExtraCharge) == -1) {
                                // copy t_menu_extra_charge
                                otherPromiseArr.push(this.copy(menuExtraChargeService,last_menu_id,new_menu_id,'extra_charge_id',t));
                            }
                            if (notCloneTypes.indexOf(cloneExclude.menuPhoto) == -1) {
                                // copy  t_menu_photo
                                otherPromiseArr.push(this.copy(menuPhotoService,last_menu_id,new_menu_id,'photo_id',t));
                            }
                            return Promise.all(otherPromiseArr);
                        });


                    });


                }
            )

        })
    }

    copy(service, last_menu_id,new_menu_id,autoIncrementKey,t) {
        return service.getModel().findAll({where:{menu_id:last_menu_id},transaction:t}).then(list => {
            let copyList = [];
            list.forEach(single => {
                let  copyObj = single.toJSON();
                copyObj.menu_id = new_menu_id;
                copyObj.parent_menu_id = last_menu_id; // for t_menu_include
                //如果设置处自增key的情况
                if (autoIncrementKey) {
                    copyObj[autoIncrementKey] = null;
                }
                copyList.push(copyObj);
            })
            return  service.baseCreateBatch(copyList,{transaction:t});
        })
    }

    replace(service, menu_id,t) {
        return service.baseUpdate({active_ind:activeIndStatus.REPLACE},{where:{menu_id:menu_id,active_ind:activeIndStatus.ACTIVE},transaction:t});
    }

    findChefByFilters(query) {
        let preSql = `select `;
        let querySql = `  m.chef_id,m.menu_id,
            avg(rating.overall_rating) menu_rating,
            user.photo_url  chef_photo_url,
            max(rating.overall_rating) highest_rate,
            menu_logo_url `
        let totalSql = `count(distinct m.chef_id)  total `;
        let sql = `from t_chef_menu m
            left join t_chef chef on m.chef_id = chef.chef_id and chef.active_ind = 'A'
            left join t_user user on chef.user_id = user.user_id and user.active_ind = 'A'
            left join t_chef_language lang on lang.chef_id = m.chef_id and lang.active_ind ='A'
            left join t_chef_cuisine cuisine  on cuisine.chef_id = m.chef_id and  cuisine.active_ind ='A'
            left join t_chef_service_location location  on location.chef_id = m.chef_id and location.active_ind ='A'
            left join t_order o on o.menu_id = m.menu_id and o.active_ind = 'A'
            left join t_user_rating rating  on rating.order_id = o.order_id
            where `+this.dateTimeDiff(query)+`
            and m.active_ind = 'A'
            `+this.filterCriteriaAppend(query)+`
            group by m.chef_id,m.menu_id`;
        let limitSql = ` order by menu_rating desc limit :startIndex , :pageSize`;
        let queryTotalSql = preSql + totalSql + sql;
        let filterSql = preSql + querySql + sql +limitSql;
        let replacements = {meal_type:query.meal_type,langCodes:query.langCodes,cuisineTypeIds:query.cuisineTypeIds,districtCodes:query.districtCodes,start_date:query.start_date,end_date:query.end_date};

        return db.query(queryTotalSql,{replacements:replacements,type:db.QueryTypes.SELECT}).then(totalRecord => {
            let result = {};
            console.log("total record:==========>",totalRecord[0]);
            if (totalRecord[0] && totalRecord[0]) {
                result.total_pages = (totalRecord[0].total  +  query.pageSize  - 1) /  query.pageSize;
            }else {
                result.total_pages = 0;
            }
            result.page_no = query.page_no;
            return db.query(filterSql,{replacements:{meal_type:query.meal_type,langCodes:query.langCodes,cuisineTypeIds:query.cuisineTypeIds,districtCodes:query.districtCodes,startIndex:query.startIndex,pageSize:query.pageSize,start_date:query.start_date,end_date:query.end_date},type:db.QueryTypes.SELECT}).then(list=> {
                if (list) {
                    let promiseArr = [];
                    list.forEach(item => {
                        if (!item.menu_logo_url) {
                            promiseArr.push(this.getLastestMenuLogoByChefId(item.chef_id).then(lastestMenu => {
                                console.log("lastestMenu=> ",lastestMenu)
                                if (lastestMenu) {
                                    item.menu_logo_url = lastestMenu.menu_logo_url;
                                }
                                return item;
                            }))
                        }else {
                            promiseArr.push(item);
                        }
                    })
                    return Promise.all(promiseArr).then( resultList => {
                        result.chef_list = resultList;
                        return result;
                    });
                }
            } )
        })
    }

    getLastestMenuLogoByChefId(chef_id) {
        let sql = `select * from t_chef_menu where chef_id = :chefId and menu_logo_url is not null and active_ind= 'A' order by create_on limit  1`;
        return db.query(sql,{replacements:{chefId:chef_id},type:db.QueryTypes.SELECT}).then(list => {
            if (list && list.length > 0) {
                return list[0];
            }
        });
    }

    updateMenuServingDetailByMenuId(chef_id, menu_id,attrs) {
        return db.transaction(t => {
            return this.getOne({where:{chef_id:chef_id,menu_id:menu_id,active_ind:activeIndStatus.ACTIVE},transaction:t}).then(chefMenu => {
                if (chefMenu) {
                    console.log("chef Menu ====>",chefMenu.public_ind)
                    if (chefMenu.public_ind === true) {
                        return this.publicMenuHandler(chefMenu.toJSON(),this,attrs,t);
                    }else {
                        return  this.updateDirectly(null, chefMenu.menu_id, null, attrs, t);
                    }
                }else {
                    throw baseResult.MENU_ID_NOT_EXIST;
                }
            })
        })

    }

    updateMenuServingDetailByMenuIdDirectly(attrs,t) {
        return this.baseUpdate(attrs,{where:{chef_id:attrs.chef_id,menu_id:attrs.menu_id,active_ind:activeIndStatus.ACTIVE},transaction:t});
    }

    publicMenuHandler(chefMenu,noOrderService,attrs,t,cloneExlcudes,dataMapByNotCloneTypes) {
        console.log("public menu handler ....",noOrderService)
        // If any existing outstanding orders (orders not yet performed) referencing this public menu_id
        return orderService.getModel().findAll({where:{menu_id:chefMenu.menu_id,active_ind:activeIndStatus.ACTIVE,event_date:{[Op.lt]:moment()}},transaction:t}).then(orderList => {
            console.log("orderlist =>",orderList)
            if (orderList && orderList.length>0) {
                return  this.baseUpdate({active_ind:activeIndStatus.REPLACE,public_ind:0},{where:{menu_id:chefMenu.menu_id,chef_id:chefMenu.chef_id},transaction:t}).then(updateCnt => {
                    console.log("begin to clone  its related records....")
                    let oldMenuId = chefMenu.menu_id;
                    let oldMenuCode = chefMenu.menu_code;
                    let newMenu = chefMenu;
                    newMenu.public_ind = 0;
                    newMenu.parent_menu_id = chefMenu.menu_id;
                    /*if (attrs.about) {
                        newMenu.about = attrs.about;
                    }
                    if (attrs.cancel_policy) {
                        newMenu.cancel_policy = attrs.cancel_policy;
                    }
*/
                    this.menuUpdatedAttrProcessor(attrs,newMenu);

                    return this.cloneNewLogic(newMenu,t,cloneExlcudes,dataMapByNotCloneTypes).then(
                        resp => {
                            attrs.menu_code = oldMenuCode; // 变性前的menu_code;
                            return messageService.insertMessageByOrderList(orderList, attrs, t).then(
                                msgList => {
                                    // old menu handler
                                    console.log("old menu ========>", oldMenuId);
                                    return this.oldMenuReferenceHandler(oldMenuId, cloneExlcudes,t);
                                }
                            );

                        }

                    )
                })
            }else {
                return noOrderService.updateDirectly(activeIndStatus.DELETE, chefMenu.menu_id, chefMenu.menu_id, attrs, t);
            }
        })
    }

    oldMenuReferenceHandler(menu_id,replaceExempt,t) {
        if (!replaceExempt) {
            replaceExempt = [];
        }
        // update
        // (t_menu_item, t_menu_item_option, t_menu_cuisine, t_menu_kitchen_req, t_menu_include, t_menu_chef_note, t_menu_booking_rule, t_menu_booking_requirement, t_menu_extra_charge, t_menu_photo).
        let promiseArr = [];
        promiseArr.push(this.replace(menuItemService, menu_id, t));

        promiseArr.push(menuItemOptionService.updateStatusByMenuId(menu_id, activeIndStatus.REPLACE, t));

        if (replaceExempt.indexOf(cloneExclude.kitchenReq) === -1) {
            promiseArr.push(this.replace(kitchenReqService, menu_id, t));
        }
        promiseArr.push(this.replace(menuCuisineService, menu_id, t));
        if (replaceExempt.indexOf(cloneExclude.menuInclude) === -1) {
            promiseArr.push(this.replace(menuIncludeService, menu_id, t));
        }
        if (replaceExempt.indexOf(cloneExclude.menuChefNote) == -1) {
            promiseArr.push(this.replace(menuChefNoteService, menu_id, t));
        }
        if (replaceExempt.indexOf(cloneExclude.menuBookingRule) == -1) {
            promiseArr.push(this.replace(menuBookingRuleService, menu_id, t));
        }
        if (replaceExempt.indexOf(cloneExclude.menuBookingRequirement) == -1) {
            promiseArr.push(this.replace(menuBookingRequirementService, menu_id, t));
        }
        if (replaceExempt.indexOf(cloneExclude.menuExtraCharge) == -1) {
            promiseArr.push(this.replace(menuExtraChargeService, menu_id, t));
        }
        if (replaceExempt.indexOf(cloneExclude.menuPhoto) == -1) {
            promiseArr.push(this.replace(menuPhotoService, menu_id, t));
        }
        return Promise.all(promiseArr);
    }

    getUserByUserId(user_id) {
        return userModel.getModel().findOne({where:{user_id:user_id,active_ind:activeIndStatus.ACTIVE}});
    }

    /*    nonPublicMenuHandler(chefMenu,noOrderService,t,cloneExlcudes,dataMapByNotCloneTypes) {
            // If any existing outstanding orders (orders not yet performed) referencing this public menu_id
            return orderService.getModel().findAll({where:{menu_id:chefMenu.menu_id,active_ind:activeIndStatus.ACTIVE,event_date:{[Op.gt]:moment()}},transaction:t}).then(orderList => {
                if (orderList) {
                    return  this.baseUpdate({active_ind:activeIndStatus.REPLACE,public_ind:0},{where:{menu_id:menu_id,chef_id:chef_id},transaction:t}).then(updatedMenu => {
                        let newMenu = updatedMenu.toJSON();
                        newMenu.public_ind = activeIndStatus.ACTIVE;
                        newMenu.parent_menu_id = updatedMenu.menu_id;
                        return this.cloneNewLogic(newMenu,t,cloneExlcudes,dataMapByNotCloneTypes).then(
                            resp => {
                                let promiseArr = [];
                                orderList.forEach( order => {
                                    let user = userService.getById(order.user_id);
                                    let notity_username = user.first_name+" "+user.last_name;
                                    let msgBody = msgCfg.update_menu_notify.format(notity_username);
                                    promiseArr.push(messageService.insertMessage(order.user_id,msgBody,{transaction:t}));
                                })
                                return Promise.all(promiseArr);
                            }

                        )
                    })
                }else {
                    return noOrderService;
                }
            })
        }*/

    updateMenuKitchenRequirementByMenuId(chef_id, menu_id, attrs) {
        return db.transaction(t => {
            return this.getOne({where:{chef_id:chef_id,menu_id:menu_id,active_ind:activeIndStatus.ACTIVE},transaction:t}).then(chefMenu => {
                if (chefMenu) {
                    if (chefMenu.public_ind === true) {
                        let cloneExcludes = [cloneExclude.kitchenReq] ;
                        let dataMap = new Map();
                        dataMap.set(cloneExclude.kitchenReq,attrs.kitchen_req_items);

                        return this.publicMenuHandler(chefMenu.toJSON(),kitchenReqService,attrs,t,cloneExcludes,dataMap);
                    }else {
                        return kitchenReqService.updateDirectly(activeIndStatus.DELETE,menu_id,menu_id,attrs.kitchen_req_items,t)
                    }
                }else {
                    throw baseResult.MENU_ID_NOT_EXIST;
                }
            })
        })
    }


    updateMenuChefNoteByMenuId(chef_id, menu_id, attrs) {
        return db.transaction(t=> {
            return this.getOne({where:{chef_id:chef_id,menu_id:menu_id,active_ind:activeIndStatus.ACTIVE},transaction:t}).then(chefMenu => {
                if (chefMenu) {

                    if (chefMenu.public_ind === true) {
                        let cloneExcludes = [cloneExclude.menuChefNote] ;
                        let dataMap = new Map();
                        dataMap.set(cloneExclude.menuChefNote,attrs.menu_chef_note_list);
                        return this.publicMenuHandler(chefMenu.toJSON(),menuChefNoteService,attrs,t,cloneExcludes,dataMap);
                    }else {
                        return menuChefNoteService.updateDirectly(activeIndStatus.DELETE,menu_id,menu_id,attrs.menu_chef_note_list,t);
                    }
                }else {
                    throw baseResult.MENU_ID_NOT_EXIST;
                }
            })
        })

    }


    updateMenuIncludeItemsByMenuId(chef_id, menu_id, attrs) {
        return db.transaction(t=> {
            return this.getOne({where:{chef_id:chef_id,menu_id:menu_id,active_ind:activeIndStatus.ACTIVE},transaction:t}).then(chefMenu => {
                if (chefMenu) {
                    /*    let noOrderService = menuIncludeService.updateMenuIncludeItemsDirectly(activeIndStatus.DELETE,menu_id,menu_id,attrs.include_items,t);*/
                    if (chefMenu.public_ind === true) {
                        let cloneExcludes = [cloneExclude.menuInclude] ;
                        let dataMap = new Map();
                        dataMap.set(cloneExclude.menuInclude,attrs.include_items);
                        return this.publicMenuHandler(chefMenu.toJSON(),menuIncludeService,attrs,t,cloneExcludes,dataMap);
                    }else {
                        return menuIncludeService.updateDirectly(activeIndStatus.DELETE,menu_id,menu_id,attrs.include_items,t);;
                    }
                }else {
                    throw baseResult.MENU_ID_NOT_EXIST;
                }
            })
        })
    }

    updateMenuAboutByMenuId(chef_id, menu_id, attrs) {
        return db.transaction(t=> {
            return this.getOne({where:{chef_id:chef_id,menu_id:menu_id,active_ind:activeIndStatus.ACTIVE},transaction:t}).then(chefMenu => {
                if (chefMenu) {

                    if (chefMenu.public_ind === true) {
                        return this.publicMenuHandler(chefMenu.toJSON(),this,attrs,t,null,null);
                    }else {
                        return  this.updateDirectly(null, chefMenu.menu_id, null, attrs, t);
                    }
                }else {
                    throw baseResult.MENU_ID_NOT_EXIST;
                }
            })
        })
    }


    menuUpdatedAttrProcessor(attrs, updateAttr) {
        if (!updateAttr) {
            updateAttr = {};
        }

        if (attrs.menu_name) {
            updateAttr.menu_name = attrs.menu_name;
        }

        if (attrs.menu_code) {
            updateAttr.menu_code = attrs.menu_code;
        }

        if (attrs.menu_desc) {
            updateAttr.menu_desc = attrs.menu_desc;
        }
        if (attrs.hasOwnProperty('public_ind')) {
            updateAttr.public_ind = attrs.public_ind;
        }
        if (attrs.unit_price) {
            updateAttr.unit_price = attrs.unit_price;
        }
        if (attrs.seq_no) {
            updateAttr.seq_no = attrs.seq_no;
        }
        if (attrs.applied_meal) {
            updateAttr.applied_meal = attrs.applied_meal;
        }
        if (attrs.min_pers) {
            updateAttr.min_pers = attrs.min_pers;
        }
        if (attrs.max_pers) {
            updateAttr.max_pers = attrs.max_pers;
        }
        if (attrs.event_duration_hr) {
            updateAttr.event_duration_hr = attrs.event_duration_hr;
        }
        if (attrs.chef_arrive_prior_hr) {
            updateAttr.chef_arrive_prior_hr = attrs.chef_arrive_prior_hr;
        }
        if (attrs.child_menu_note) {
            updateAttr.child_menu_note = attrs.child_menu_note;
        }
        if (attrs.about) {
            updateAttr.about = attrs.about;
        }
        if (attrs.cancel_policy) {
            updateAttr.cancel_policy = attrs.cancel_policy;
        }

        return updateAttr;
    }
    /**
     * func 22
     *
     {
         "menu_id": 0,
         "applied_meal": 1,
         "min_pers": 0,
         "max_pers": 0,
         "event_duration_hr": 0,
         "chef_arrive_prior_hr": 0,
         "child_menu_note": "string"
     }
     * update about
     * update cancel policy
     *
     *
     */
    updateDirectly(status, last_menu_id, new_menu_id, attrs, t){
        let updateAttr = this.menuUpdatedAttrProcessor(attrs);
        return this.baseUpdate(updateAttr,{where:{menu_id:last_menu_id,chef_id:attrs.chef_id,active_ind:activeIndStatus.ACTIVE},transaction:t});
    }


    getMenuRatingByMenuId(criteria) {
        let sql = `select
          avg(rating.service_quality)             service_quality,
          avg(mastery_flavour_cooking_techniques) mastery_flavour_cooking_techniques,
          avg(personality_of_chef_in_cuisine)     personality_of_chef_in_cuisine,
          avg(hygene)                             hygene,
          avg(rating.value_for_money)             value_for_money,
          avg(rating.menu_quality)                menu_quality,
          avg(rating.overall_rating)              overall_rating
        from t_chef_menu m left join
          t_order o on o.menu_id = m.menu_id and  o.active_ind = 'A' 
          left join t_user_rating rating on o.order_id = rating.order_id and rating.active_ind = 'A'
        where m.menu_id = :menu_id and m.active_ind = 'A'
        group by m.menu_id`;
        return db.query(sql,{replacements:{menu_id:criteria.menu_id},type:db.QueryTypes.SELECT}).then(resp => {
            let result = resp;
            result.menu_id = criteria.menu_id;
            return result;
        });
    }

    getMenuReviewsByMenuId(menuId) {
        let sql = `select
              service_quality,
              menu_quality,
              mastery_flavour_cooking_techniques,
              personality_of_chef_in_cuisine,
              hygene,
              value_for_money,
              overall_rating,
              remarks_html,
              user.photo_url,
              user.last_name,
              user.first_name
            from t_user_rating rating left join t_order o on rating.order_id = o.order_id and o.active_ind = 'A'
              left join t_chef_menu m on o.menu_id = m.menu_id and m.active_ind = 'A'
              left join t_user user on rating.user_id = user.user_id and  user.active_ind = 'A'
            where rating.active_ind = 'A' and m.menu_id = :menu_id`;
        return db.query(sql,{replacements:{menu_id:menuId},type:db.QueryTypes.SELECT}).then(list => {
            let result = {};
            result.menu_id = menuId;
            result.review_list = list;
            return result;
        })
    }

    updateMenuVisibility(attrs) {
        return db.transaction(t => {
            return this.getOne({where:{menu_id:attrs.menu_id,chef_id:attrs.chef_id
                    ,active_ind:activeIndStatus.ACTIVE},transaction:t}).then(
                menu => {
                    if (menu){

                        console.log("old menu =======>",menu.public_ind,attrs.public_ind)
                        if (Number(menu.public_ind) === attrs.public_ind) {
                            throw baseResult.MENU_NO_CHANGE_AVAILABILITY;
                        }else {
                            return this.baseUpdate({public_ind:attrs.public_ind},
                                {where:{menu_id:menu.menu_id,chef_id:menu.chef_id},transaction:t}).then(
                                resp => {
                                    if (attrs.public_ind === 0 && Number(menu.public_ind) === 1){
                                        attrs.menu_code = menu.menu_code;
                                        return orderService.getModel().findAll({where:{menu_id:menu.menu_id,active_ind:activeIndStatus.ACTIVE,event_date:{[Op.gt]:moment()}},transaction:t}).then(orderList => {
                                            if (orderList) {
                                                return  messageService.insertMessageByOrderList(orderList, attrs, t);
                                            }
                                        })
                                    }
                                }

                            )
                        }
                    }else {
                        throw baseResult.MENU_ID_NOT_EXIST;
                    }
                }
            )
        })

    }

    updateMenuCancelPolicy(attrs) {
        return db.transaction(t => {
            return this.getOne({where:{chef_id:attrs.chef_id,menu_id:attrs.menu_id,active_ind:activeIndStatus.ACTIVE},transaction:t}).then(chefMenu => {
                if (chefMenu) {
                    if (chefMenu.public_ind === true) {
                        return this.publicMenuHandler(chefMenu.toJSON(),this,attrs,t);
                    }else {
                        return  this.updateDirectly(null, chefMenu.menu_id, null, attrs, t);;
                    }
                }else {
                    throw baseResult.MENU_ID_NOT_EXIST;
                }
            })
        })
    }
    updateMenuCancelPolicyDirectly(attrs, t) {
        return this.baseUpdate({cancel_policy:attrs.cancel_policy},
            {where:{menu_id:attrs.menu_id,chef_id:attrs.chef_id,active_ind:activeIndStatus.ACTIVE},transaction:t});
    }
    getMenuListByChefsChoice(attrs) {
        return this.getMenuListBy(attrs);
    }
    getMenuListBy(attrs) {
        let query_col_sql = `SELECT m.menu_id, m.chef_id, m.menu_name, m.menu_code, m.menu_desc,
                m.public_ind, m.min_pers, m.max_pers, m.menu_logo_url,m.unit_price, m.seq_no,
                avg(rating.overall_rating) menu_rating,
                count(distinct o.order_id) orderPlacedNum,
                sum(rating.rating_id)      num_of_review`;
        let total_sql = `select count(DISTINCT m.menu_id) total `;
        let sql =` FROM t_chef_menu m  
                LEFT JOIN t_order o ON o.menu_id = m.menu_id AND o.active_ind = 'A' and o.order_status = 'C'
                LEFT JOIN t_user_rating rating ON o.order_id = rating.order_id AND rating.active_ind = 'A'
                WHERE m.active_ind = 'A' and m.public_ind IN (:publicIndArr) `;
        if (attrs.byRecommend) {
            sql += `AND m.chef_recommend_ind = 1`;
        }
        sql += ` GROUP BY `;

        sql += ` m.menu_id `;
        let orderBySql = ` ORDER BY `;
        if (attrs.byPopular) {
            orderBySql += ` orderPlacedNum desc,`;
        }
        orderBySql += ` menu_rating desc, m.update_on desc `;
        let limit_sql = ` limit :startIdx , :pageSize `;
        let queryPageCount = total_sql + sql;
        let pageQuerySql = query_col_sql + sql +orderBySql+ limit_sql;
        return db.query(queryPageCount,{replacements:attrs,
            type:db.QueryTypes.SELECT}).then(totalCount => {
            console.log("query totalCount:========>",totalCount)
            let total_pages;
            if (totalCount  && totalCount[0]) {
                total_pages = (totalCount[0].total  +  attrs.pageSize  - 1) /  attrs.pageSize;
            }else {
                total_pages = 0;
            }

            return db.query(pageQuerySql,{replacements:attrs,
                type:db.QueryTypes.SELECT}).then(
                menuList => {
                    if (menuList) {
                        return locationService.getLocationsByMenuList(menuList).then(list => {
                            let result = {};
                            result.page_no = attrs.page_no;
                            result.total_pages = total_pages;
                            result.menu_list = list;
                            return result;
                        });
                    }
                }
            )
        } )
    }

    getMenuListByRating(attrs) {
        return this.getMenuListBy(attrs);
    }
    getArchiveDetailByChefId(chef_id) {
        let sql = `SELECT
          m.chef_id,
          count(DISTINCT m.menu_id) menu_qty,
          count(DISTINCT section.menu_section_id) section_qty,
          count(DISTINCT food.food_item_id) dish_qty,
          (CASE WHEN m.family_menu = 1 THEN count(DISTINCT menu_id) END) family_menu_qty,
          (CASE WHEN m.work_menu = 1 THEN count(DISTINCT menu_id) END) work_menu_qty
        from t_chef_menu m
        LEFT JOIN t_food_item food on food.chef_id = m.chef_id AND food.active_ind ='A'
        LEFT JOIN t_menu_section section  on section.chef_id = m.chef_id AND  section.active_ind ='A'
        WHERE m.active_ind = 'A' AND m.chef_id = :chef_id
        GROUP BY m.chef_id`;
        return db.query(sql,{replacements:{chef_id:chef_id},type:db.QueryTypes.SELECT});
    }


    checkMenuCanCreateOrder(creatOrderRequest) {
        return this.getOneByMenuId(creatOrderRequest.menu_id).then(
            menu => {
                if (menu) {
                    if (menu.public_ind === false) {
                        throw baseResult.ORDER_ONLY_PUBLIC_MENU_CAN_CREATED;
                    }else if(menu.public_ind === true) {
                        let d1 = moment(creatOrderRequest.event_date);
                        let diffDays = d1.diff(moment(),'days');
                        console.log("diff days=>",diffDays)
                        if (diffDays < menu.preparation_days) {
                            throw baseResult.ORDER_MUSE_BE_PLACED_BEFORE_PREORDER_DATE
                        }
                    }
                }else {
                    throw baseResult.MENU_ID_NOT_EXIST;
                }
            }
        );

    }
    dateTimeDiff(query) {
        let criteria = '';
        if (query.start_date && query.end_date) {
            //case 1
            criteria = ` ( m.start_date >= :start_date and m.end_date <=:end_date `;
            // case 2
            criteria += ` or (m.start_date<=:end_date) `;
            // case 3
            criteria += ` or (m.end_date >= :start_date) `;
            // case 4
            criteria += ' or (m.start_date <=:start_date and m.end_date >=:end_date) )  ';

        }else if (query.start_date) {
            // first over all test  updated
            criteria =  `(m.start_date >=:start_date `;
            // case 3;
            criteria += `or (m.end_date >= :start_date)  )`;

        }else if(query.end_date) {
            criteria = `( m.end_date >= sysdate() `;
            criteria +=  ` or (m.start_date <=:end_date and m.end_date >=:end_date ) ) `;
        }
        return criteria;

    }
    filterCriteriaAppend(query) {
        let criteria = '';
        if (query.meal_type) {
            criteria += ` and applied_meal=:meal_type `;
        }
        if (query.langCodes && query.langCodes.length > 0) {
            criteria += ` and lang.lang_code in (:langCodes) `;
        }
        if (query.cuisineTypeIds && query.cuisineTypeIds.length > 0)  {
            criteria += ` and cuisine.cuisine_type_id in (:cuisineTypeIds) `;
        }
        if (query.districtCodes && query.districtCodes.length > 0)  {
            criteria += `  and location.district_code in (:districtCodes) `;
        }
        return criteria;
    }

    findMenuByFilters(query) {
        let countSql = `select count(distinct m.menu_id) total`;
        let querySql = ` select tc.chef_id,m.menu_id,m.menu_name,m.menu_desc,u.first_name,u.last_name,u.middle_name,
          m.min_pers,m.max_pers,m.unit_price,
          u.photo_url chef_photo_url,m.menu_logo_url,u.user_id,
          count(rating.user_id) num_of_review,
          avg(overall_rating) menu_rating `;
        let sql = ` from t_chef_menu m
          left join t_chef tc on m.chef_id = tc.chef_id and tc.active_ind = 'A'
          left join t_chef_language lang on lang.chef_id = m.chef_id and lang.active_ind ='A'
          left join t_chef_cuisine cuisine  on cuisine.chef_id = m.chef_id and  cuisine.active_ind ='A'
          left join t_chef_service_location location  on location.chef_id = m.chef_id and location.active_ind ='A'
          left join t_user u on tc.user_id = u.user_id and u.active_ind = 'A'
          left join t_order o on o.menu_id = m.menu_id and  o.active_ind = 'A'
          left join t_user_rating rating on o.order_id = rating.order_id and rating.active_ind ='A'  
          where `+this.dateTimeDiff(query)+` and
          m.active_ind = 'A' `+this.filterCriteriaAppend(query)+` group by  m.menu_id `;
        let orderBySql = ' order by menu_rating desc limit :startIndex,:pageSize ';
        let totalSql = countSql + sql;
        let filterSql = querySql + sql + orderBySql;
        return db.query(totalSql,{replacements:query,type:db.QueryTypes.SELECT}).then(totalRecord => {
            let result = {};
            console.log("totalRecord==========>",totalRecord)
            if (totalRecord && totalRecord.length > 0) {
                result.total_pages = (totalRecord[0].total  +  query.pageSize  - 1) /  query.pageSize;
            }else {
                result.total_pages = 0;
                result.page_no = query.page_no;
                result.menu_list = [];
                return result;

            }
            result.page_no = query.page_no;

            return db.query(filterSql,{replacements:query,type:db.QueryTypes.SELECT}).then(
                list => {
                    let promiseArr = [];
                    list.forEach(menu => {
                        promiseArr.push(chefService.getCityList(menu,query.districtCodes));
                    })
                    return Promise.all(promiseArr).then(list => {
                        result.menu_list = list;
                        return result;
                    })
                }
            )
        })


    }

    checkMenuCode(menu_id, menu_code) {
        // menu_code 唯一
        return this.getOne({where:{menu_code:menu_code,menu_id:menu_id,active_ind:'A'}}).then(menu => {
            console.log("menu_code get menu =>",menu_code,menu)
            if (menu && menu.menu_id !== menu_id){
                throw 'menu_code:'+menu_code+" is used with  menu_id:"+menu.menu_id;
            }
        })
    }
}

//module.exports = new ChefMenuService()
export default new ChefMenuService()