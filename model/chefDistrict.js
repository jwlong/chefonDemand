import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'

class ChefDistrict extends BaseModel {
    constructor () {
        super('chef_district', {
            chef_id:{type: Sequelize.INTEGER(9),allowNull: false},
            district_id:{type: Sequelize.INTEGER(7), allowNull: false},
        },{
            // 禁止sequelize修改表名，默认会在animal后边添加一个字母`s`表示负数
            freezeTableName: true,
            timestamps: false,
        })
        this.model = super.getModel()
        this.model.sync()
    }
}
module.exports = new ChefDistrict()