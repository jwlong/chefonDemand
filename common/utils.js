import baseResult from "../model/baseResult";
import accessTokenService from "../service/accessTokenService";
import moment from 'moment'

const userContext = require('../common/userContext')
const utils = {
    keyLowerCase(object) {
        let regObj = new RegExp("([A-Z]+)", "g");
        for (let i in object) {
            if (object.hasOwnProperty(i)) {
                let temp = object[i];
                if (regObj.test(i.toString())) {
                    temp = object[i.replace(regObj, function (result) {
                        return result.toLowerCase();
                    })] = object[i];
                    delete object[i];
                }
                if (typeof temp === 'object' || Object.prototype.toString.call(temp) === '[object Array]') {
                    this.keyLowerCase(temp);
                }
            }
        }
        return object;
    },
    setCustomTransfer(entity, type) {
        if (entity) {
            entity.update_on = new Date();
            if (userContext.userId) {
                entity.update_by = userContext.userId;
                if (type === 'create') {
                    entity.create_on = new Date();
                    entity.create_by = userContext.userId;
                }

            } else {
                entity.update_by = userContext.robot_id;
                entity.create_by = userContext.robot_id;
            }
            if (!entity.active_ind) {
                entity.active_ind = 'A';
            }
        }
        return entity;
    },
    setGlobalTransfer(entity, actionType) {
        let fields = entity ? entity.fields : [];
        let attr = entity ? entity.attributes : {};
        fields.push('update_on', 'update_by');
        attr.update_on = new Date();
        if (userContext.userId) {
            entity.update_by = userContext.userId;
            if (actionType === 'create') {
                fields.push('create_on', 'create_by');
                attr.create_on = new Date();
                attr.create_by = userContext.userId;
            }

        } else {
            attr.update_by = userContext.robot_id;
            attr.create_by = userContext.robot_id;
        }
        if (!attr.active_ind) {
            attr.active_ind = 'A';
        }
    },
    validToken(tokenString, req) {
        return accessTokenService.getModel().findOne({where: {token_string: tokenString}}).then(accessToken => {
            console.log("access token =>", accessToken);
            if (accessToken) {// access token exist
                if (moment(accessToken.valid_until).isBefore(moment())) {
                    throw baseResult.USER_VERITY_EXPIRED;
                }
                userContext.userId = accessToken.user_id;
                req.user_id = userContext.userId;
            } else {
                throw baseResult.USER_VERITY_INVALID;
            }

        })
    },
    deepCopy(obj, cache) {
        if (cache === void 0) cache = [];

        // just return if obj is immutable value
        if (obj === null || typeof obj !== 'object') {
            return obj
        }

        // if obj is hit, it is in circular structure
        var hit = find(cache, function (c) {
            return c.original === obj;
        });
        if (hit) {
            return hit.copy
        }

        var copy = Array.isArray(obj) ? [] : {};
        // put the copy into cache at first
        // because we want to refer it in recursive deepCopy
        cache.push({
            original: obj,
            copy: copy
        });

        Object.keys(obj).forEach(function (key) {
            copy[key] = deepCopy(obj[key], cache);
        });

        return copy
    }

}
export default utils;