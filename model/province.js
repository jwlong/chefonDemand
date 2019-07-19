import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import country from './country.js'
class Province extends BaseModel {
    constructor () {
        super('province', {
            province_code:{type: Sequelize.STRING(5), primaryKey: true},
            province_name:{type: Sequelize.STRING(30), allowNull: false},
            country_code:{type:Sequelize.STRING(5),allowNull: false},
            active:{type:Sequelize.BOOLEAN,defaultValue:true,allowNull: false}
        },{
            // 禁止sequelize修改表名，默认会在animal后边添加一个字母`s`表示负数
            freezeTableName: true,
            timestamps: false,
        })
        this.model = super.getModel()
        this.model.sync()
        console.log("hello")
        this.model.belongsTo(country['model'],{as:'country', foreignKey:'country_code'})
    }
}
module.exports = new Province()