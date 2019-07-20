import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'

class CuisineType extends BaseModel {
    constructor () {
        super('cuisine_type', {
            cuisine_type_id:{type: Sequelize.INTEGER(9), primaryKey: true,autoIncrement:true},
            cuisine_type_name:{type: Sequelize.STRING(30), allowNull: false},
            description:{type: Sequelize.STRING(300)},
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