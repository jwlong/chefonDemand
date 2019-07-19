import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import  province from './province'
import  city from './cityModel'
class Area extends BaseModel {
    constructor () {
        super('area', {
            area_code:{type: Sequelize.STRING(5), primaryKey: true},
            area_name:{type: Sequelize.STRING(30), allowNull: false},
            province_code:{type: Sequelize.STRING(5),allowNull: false},
            city_code: {type:Sequelize.STRING(5),allowNull: false},
            active:{type:Sequelize.BOOLEAN,defaultValue:true,allowNull: false}
        },{
            // 禁止sequelize修改表名，默认会在animal后边添加一个字母`s`表示负数
            freezeTableName: true,
            timestamps: false,
        })
        this.model = super.getModel()
        this.model.sync()
        this.model.belongsTo(province['model'],{as:'province',foreignKey:'province_code'});// add province_code to Area Model
        this.model.belongsTo(city['model'],{as: 'city',foreignKey:'city_code'}) // add city_code to Area Model
    }
}
module.exports = new Area()