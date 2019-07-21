/**
 * Created by aa on 2019/7/20.
 */
import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import chefMenu from './chefMenu'
class MenuDetails extends BaseModel {
    constructor () {
        super('menu_details', {
            menu_detail_id:{type: Sequelize.INTEGER(9), primaryKey: true},
            menu_id:{type: Sequelize.INTEGER(9), allowNull: false},
            menu_name:{type: Sequelize.STRING(30), allowNull: false},
            description:{type: Sequelize.STRING(300)},
        },{
            // 禁止sequelize修改表名，默认会在animal后边添加一个字母`s`表示负数
            freezeTableName: true,
            timestamps: false,
        })
        this.model = super.getModel()
        this.model.sync()
        this.model.belongsTo(chefMenu['model'],{foreignKey:'menu_id'})
    }
}
module.exports = new MenuDetails()