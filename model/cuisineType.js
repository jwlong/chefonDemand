import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'

class CuisineType extends BaseModel {
    constructor () {
        super('district', {
            district_id:{type: Sequelize.INTERGER(7), primaryKey: true,autoIncrement:true},
            district_name:{type: Sequelize.STRING(30), allowNull: false},
            town_code:{type: Sequelize.STRING(5)},
            city_code: {type:Sequelize.STRING(5)},
        },{
            // 禁止sequelize修改表名，默认会在animal后边添加一个字母`s`表示负数
            freezeTableName: true,
            timestamps: false,
        })
        this.model = super.getModel()
        this.model.sync()
    }
}
module.exports = new CuisineType()