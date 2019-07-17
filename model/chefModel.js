import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'

class ChefModel extends BaseModel {
    constructor () {
        super('chef', {
            chef_id:{type: Sequelize.INTEGER(9), primaryKey: true,autoIncrement: true},
            first_name:{type: Sequelize.STRING(30), allowNull: false},
            middle_name:{type: Sequelize.STRING(30)},
            last_name: {type:Sequelize.STRING(30),allowNull: false},
        },{
            // 禁止sequelize修改表名，默认会在animal后边添加一个字母`s`表示负数
            freezeTableName: true,
            timestamps: false,
        })
        this.model = super.getModel()
        this.model.sync()
    }
}
module.exports = new ChefModel()