import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import province from './province'
import area from './area'
class CityModel extends BaseModel {
    constructor () {
        super('city', {
            city_code:{type: Sequelize.STRING(5), primaryKey: true},
            city_name:{type: Sequelize.STRING(30), allowNull: false},
            province_code:{type: Sequelize.STRING(5),allowNull: false},
            area_code: {type:Sequelize.STRING(5)},
            active:{type:Sequelize.BOOLEAN,defaultValue:true}
        },{
            // 禁止sequelize修改表名，默认会在animal后边添加一个字母`s`表示负数
            freezeTableName: true,
            timestamps: false,
            comment: 'City that related to Province / Area'
          })
        this.model = super.getModel()
        this.model.sync()
        this.model.belongsTo(province['model'],{as:'province',foreignKey:'province_code'}) // add province_code to cityModel
      //  this.model.hasOne(area['model'],{as:'area',foreignKey:'area_code'}) // add area_code to cityModel,这个在多的一端来维护

    }
}
module.exports = new CityModel()