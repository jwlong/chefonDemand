import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'

class ChefLanguage extends BaseModel {
    constructor () {
        super('chef_language', {
            chef_id:{type: Sequelize.INTEGER(9),allowNull: false},
            language_code:{type: Sequelize.STRING(30), allowNull: false},
        },{
            // 禁止sequelize修改表名，默认会在animal后边添加一个字母`s`表示负数
            freezeTableName: true,
            timestamps: false,
        })
        this.model = super.getModel()
        this.model.sync()
    }
}
module.exports = new ChefLanguage()