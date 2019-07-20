import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import  chef from './chefModel'
import language from './language'
class ChefLanguage extends BaseModel {
    constructor () {
        super('chef_language', {
            chef_id:{type: Sequelize.INTEGER(9),allowNull: false,primaryKey:true},
            language_code:{type: Sequelize.STRING(30), allowNull: false,primaryKey:true},
        },{
            // 禁止sequelize修改表名，默认会在animal后边添加一个字母`s`表示负数
            freezeTableName: true,
            timestamps: false,
        })
        this.model = super.getModel()
        this.model.sync()
        this.model.belongsTo(chef['model'],{foreignKey:'chef_id'})
        this.model.belongsTo(language['model'],{foreignKey:'language_code'})
    }
}
module.exports = new ChefLanguage()