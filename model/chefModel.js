import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import db from '../config/db.js'
import language from './language'
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
       // this.model.belongsToMany(language['model'],{through:'chef_language',as:'chef_language'})
        //this.model.belongsToMany(language['model'],{as:'langs',through:'chef_language',foreignKey:'chef_id'})
    }

    getChefList(attr) {
        console.log(attr);
        attr = {chef_id:attr.chef_id,first_name:(attr.first_name)?(attr.first_name): ''};
        return db.query('select c.first_name,c.last_name from chef  c left join chef_district d on d.chef_id = c.chef_id where c.chef_id= :chef_id and c.first_name = :first_name',{ replacements:attr,type:db.QueryTypes.SELECT});
    }
}
module.exports = new ChefModel()