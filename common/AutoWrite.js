//模拟工厂模式，给每个target的原型上注入新属性
module.exports = {
    AutoWritedChefDistrict(target, key, descriptor){
        target.model = require('../model/chefDistrict')
    },
    AutoWritedChefLanguage(target, key, descriptor){
        target.model = require('../model/chefLanguage')
    },
    AutoWritedChefMenu(target, key, descriptor){
        target.model = require('../model/chefMenu')
    },
    AutoWritedChefModel(target, key, descriptor){
        target.model = require('../model/chefModel')
    },
    AutoWritedCityModel(target, key, descriptor){
        target.model = require('../model/cityModel')
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
    AutoWritedMenuType(target,key,desc) {
        target.model = require('../model/menuType')
    },
}