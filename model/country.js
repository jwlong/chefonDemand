import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'

class Country extends BaseModel {
    constructor () {
        super('country', {
            country_code:{type: Sequelize.STRING(3), primaryKey: true},
            country_name:{type: Sequelize.STRING(30), allowNull: false},
            active:{type:Sequelize.BOOLEAN,defaultValue:true}
        },{
            // 禁止sequelize修改表名，默认会在animal后边添加一个字母`s`表示负数
            freezeTableName: true,
            timestamps: false,
        })
        this.model = super.getModel()
        this.model.sync()
    }
}
module.exports = new Country()