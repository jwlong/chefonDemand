import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import chef from './chefModel'
import district from './district'
class ChefDistrict extends BaseModel {
    constructor () {
        super('chef_district', {
            chef_id:{type: Sequelize.INTEGER(9),allowNull: false,primaryKey:true},
            district_id:{type: Sequelize.INTEGER(7), allowNull: false,primaryKey:true},
        },{
            // 禁止sequelize修改表名，默认会在animal后边添加一个字母`s`表示负数
            freezeTableName: true,
            timestamps: false,
        })
        this.model = super.getModel()
        this.model.sync()
        this.model.belongsTo(district['model'],{foreignKey:'district_id'})
        this.model.belongsTo(chef['model'],{foreignKey:'chef_id'})
    }
}
module.exports = new ChefDistrict()