import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import cuisineType from './cuisineType'
class MenuType extends BaseModel {
    constructor () {
        super('menu_type', {
            menu_type_id:{type: Sequelize.INTEGER(9), primaryKey: true},
            cuisine_type_id:{type: Sequelize.INTEGER(9), allowNull: false},
            kid_menu:{type:Sequelize.BOOLEAN}
        },{
            // 禁止sequelize修改表名，默认会在animal后边添加一个字母`s`表示负数
            freezeTableName: true,
            timestamps: false,
        })
        this.model = super.getModel()
        this.model.sync()
        this.model.belongsTo(cuisineType['model'],{foreignKey:'cuisine_type_id'})
    }
}
module.exports = new MenuType()