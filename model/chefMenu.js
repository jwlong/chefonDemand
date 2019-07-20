import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import chef from './chefModel'
import menuType from './menuType'
class ChefMenuModel extends BaseModel {
    constructor () {
        super('chef_menu', {
            menu_id:{type: Sequelize.INTEGER(9), primaryKey: true,autoIncrement: true},
            chef_id:{type: Sequelize.INTEGER(9), allowNull: false},
            menu_type_id:{type: Sequelize.INTEGER(9)},
            detail_url: {type:Sequelize.STRING(300),allowNull: false},
        },{
            // 禁止sequelize修改表名，默认会在animal后边添加一个字母`s`表示负数
            freezeTableName: true,
            timestamps: false,
        })
        this.model = super.getModel()
        this.model.sync()
        this.model.belongsTo(chef['model'],{foreignKey:'chef_id'})
        this.model.belongsTo(menuType['model'],{foreignKey:'menu_type_id'})
    }
}
module.exports = new ChefMenuModel()