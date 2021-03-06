//模拟工厂模式，给每个target的原型上注入新属性
module.exports = {
    AutoWritedAccessToken(target, key, descriptor){
        target.model = require('../model/accessToken')
    },
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
    AutoWritedUser(target,key,desc) {
        target.model = require('../model/user')
    },
    AutoWritedChefAVLTimeSlot(target,key,desc) {
        target.model = require('../model/chefAvailableTimeslot')
    },
    AutoWritedChefUnAVLTimeSlot(target,key,desc) {
        target.model = require('../model/chefUnavilableTimeslot')
    },
    AutoWritedDefaultScheule(target,key,desc) {
        target.model = require('../model/chefDefaultScheule')
    },
    AutoWritedChefExp(target,key,desc) {
        target.model = require('../model/chefExperience')
    },
    AutoWritedChefCuisine(target,key,desc) {
        target.model = require('../model/chefCuisine')
    },
    AutoWritedChefLocation(target,key,desc) {
        target.model = require('../model/chefServiceLocation')
    },
    //menu new add
    AutoWritedMenuItem(target,key,desc) {
        target.model = require('../model/menuItem')
    },
    AutoWritedMenuItemOption(target,key,desc) {
        target.model = require('../model/menuItemOption')
    },
    AutoWritedKitchenReq(target,key,desc) {
        target.model = require('../model/menuKitchenReq')
    },
    AutoWritedKitchenReqItem(target,key,desc) {
        target.model = require('../model/kitchenReqItem')
    },
    AutoWritedMenuChefNote(target,key,desc) {
        target.model = require('../model/menuChefNote')
    },
    AutoWritedIncludeItem(target,key,desc) {
        target.model = require('../model/includeItem')
    },
    AutoWritedMenuInclude(target,key,desc) {
        target.model = require('../model/menuInclude')
    },
    AutoWritedMenuPhoto(target,key,desc) {
        target.model = require('../model/menuPhoto')
    },
    AutoWritedMenuBookingReq(target,key,desc) {
        target.model = require('../model/menuBookingRequirement')
    },
    AutoWritedMenuCuisine(target,key,desc) {
        target.model = require('../model/menuCuisine')
    },
    AutoWritedMenuSection(target,key,desc) {
        target.model = require('../model/menuSection')
    },
    AutoWritedFoodItem(target,key,desc) {
        target.model = require('../model/foodItem')
    },
    AutoWritedMenuBookingRule(target,key,desc) {
        target.model = require('../model/menuBookingRule')
    },
    AutoWritedmenuExtraCharge(target,key,desc) {
        target.model = require('../model/menuExtraCharge')
    },
    AutoWritedOrder(target,key,desc) {
        target.model = require('../model/order')
    },
    AutoWritedMessage(target,key,desc) {
        target.model = require('../model/message')
    },
    AutoWritedUserRate(target,key,desc) {
        target.model = require('../model/userRating')
    },
    AutoWritedUserPref(target,key,desc) {
        target.model = require('../model/userPref')
    },
    AutoWritedOrderItem(target,key,desc) {
    target.model = require('../model/orderItem')
    },
    AutoWritedOrderItemOption(target,key,desc) {
        target.model = require('../model/orderItemOption')
    },
    AutoWritedOrderGuest(target,key,desc) {
        target.model = require('../model/orderGuestList')
    },
    AutoWritedUserMenuView(target,key,desc) {
        target.model = require('../model/userMenuView')
    },
}