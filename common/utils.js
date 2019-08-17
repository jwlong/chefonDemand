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
                    keyLowerCase(temp);
                }
            }
        }
        return object;
    }
}
export  default utils;