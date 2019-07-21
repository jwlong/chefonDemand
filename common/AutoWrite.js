//模拟工厂模式，给每个target的原型上注入新属性
module.exports = {
    AutoWritedArea(target, key, descriptor){
        target.model = require('../model/area')
    },
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
    AutoWritedCountry(target, key, descriptor){
        target.model = require('../model/country')
    },
    AutoWritedCuisineType(target, key, descriptor){
        target.model = require('../model/cuisineType')
    },
    AutoWritedCityDistrict(target, key, descriptor){
        target.model = require('../model/cityDistrict')
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
    AutoWritedMenuDetails(target,key,desc) {
        target.model = require('../model/menuDetails')
    },
    AutoWritedProvince(target,key,desc) {
        target.model = require('../model/province')
    },
    AutoWritedTown(target,key,desc) {
        target.model = require('../model/town')
    }
}