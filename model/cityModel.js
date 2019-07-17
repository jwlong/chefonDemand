import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'

class CityModel extends BaseModel {
    constructor () {
        super('city', {
            city_code:{type: Sequelize.STRING(5), primaryKey: true},
            city_name:{type: Sequelize.STRING(30), allowNull: false},
            province_code:{type: Sequelize.STRING(5),allowNull: false},
            area_code: {type:Sequelize.STRING(5)},
            active:{type:Sequelize.BOOLEAN,defaultValue:1}
        },{
            // 禁止sequelize修改表名，默认会在animal后边添加一个字母`s`表示负数
            freezeTableName: true,
            timestamps: false,
          })
        this.model = super.getModel()
        this.model.sync()
    }
}
module.exports = new CityModel()