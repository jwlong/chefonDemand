import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import chef from './chefModel'
class Language extends BaseModel {
    constructor () {
        super('language', {
            language_code:{type: Sequelize.STRING(5), primaryKey: true},
            Language_Name:{type: Sequelize.STRING(30), allowNull: false},
        },{
            // 禁止sequelize修改表名，默认会在animal后边添加一个字母`s`表示负数
            freezeTableName: true,
            timestamps: false,
        })
        this.model = super.getModel()
        this.model.sync()
    }
}
module.exports = new Language()