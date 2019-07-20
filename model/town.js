import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import province from  './province'
import area from  './area'

class Town extends BaseModel {
    constructor () {
        super('town', {
            town_code:{type: Sequelize.STRING(5), primaryKey: true},
            town_name:{type: Sequelize.STRING(30), allowNull: false},
            province_code:{type:Sequelize.STRING(5),allowNull: false},
            area_code:{type:Sequelize.STRING(5)},
            active:{type:Sequelize.BOOLEAN,defaultValue:true,allowNull: false}
        },{
            // 禁止sequelize修改表名，默认会在animal后边添加一个字母`s`表示负数
            freezeTableName: true,
            timestamps: false,
        })
        this.model = super.getModel()
        this.model.sync()
        this.model.belongsTo(province['model'],{foreignKey:'province_code'})
        this.model.belongsTo(area['model'],{foreignKey:'area_code'})
    }
}
module.exports = new Town()