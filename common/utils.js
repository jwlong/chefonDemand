const  userContext = require('../common/userContext')
const utils = {
    keyLowerCase(object) {
        let regObj = new RegExp("([A-Z]+)", "g");
        for (let i in object) {
            if (object.hasOwnProperty(i)) {
                let temp = object[i];
                if (regObj.test(i.toString())) {
                    temp = object[i.replace(regObj, function (result) {
                        return  result.toLowerCase();
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
    setCustomTransfer(entity,type) {
        if (entity) {
            entity.update_on = new Date();
            if (userContext.userId) {
                entity.update_by = userContext.userId;
                if (type === 'create') {
                    entity.create_on = new Date();
                    entity.create_by = userContext.userId;
                }

            }else {
                entity.update_by = userContext.robot_id;
                entity.create_by = userContext.robot_id;
            }

            entity.active_ind = 'A';
        }

        return entity;
    }
}
export  default utils;