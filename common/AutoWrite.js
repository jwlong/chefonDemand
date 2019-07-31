//模拟工厂模式，给每个target的原型上注入新属性
module.exports = {
    AutoWritedChefLanguage(target, key, descriptor){
        target.model = require('../model/chefLanguage')
    },
    AutoWritedChefMenu(target, key, descriptor){
        target.model = require('../model/chefMenu')
    },
    AutoWritedChefModel(target, key, descriptor){
        target.model = require('../model/chef')
    },
    AutoWritedCityModel(target, key, descriptor){
        target.model = require('../model/city')
    },
    AutoWritedCountry(target, key, descriptor){
        target.model = require('../model/country')
    },
    AutoWritedCuisineType(target, key, descriptor){
        target.model = require('../model/cuisineType')
    },
    AutoWritedDistrict(target,key,desc) {
        target.model = require('../model/district')
    },
    AutoWritedLanguage(target,key,desc) {
        target.model = require('../model/language')
    },
    AutoWritedProvince(target,key,desc) {
        target.model = require('../model/province')
    },
}