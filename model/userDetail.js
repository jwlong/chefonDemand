import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'

class UserDetail extends BaseModel {
    constructor () {
        super('user_detail', {
            user_id:{type: Sequelize.INTEGER(9), primaryKey: true,autoIncrement:true},
            user_name:{type: Sequelize.STRING(30), allowNull: false},
        },{
            // 禁止sequelize修改表名，默认会在animal后边添加一个字母`s`表示负数
            freezeTableName: true,
            timestamps: false,
            comment: 'User Detail information'
          })
        this.model = super.getModel()
        this.model.sync()
    }
}
module.exports = new UserDetail()