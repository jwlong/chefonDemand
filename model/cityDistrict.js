import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import chef from './chefModel'
import district from './district'
class CityModel extends BaseModel {
    constructor () {
        super('city_district', {
            chef_id:{type: Sequelize.INTEGER(9), primaryKey: true},
            district_id:{type:Sequelize.INTEGER(7),primaryKey:true}
        },{
            // 禁止sequelize修改表名，默认会在animal后边添加一个字母`s`表示负数
            freezeTableName: true,
            timestamps: false,
            comment: "Chef's Service District"
          })
        this.model = super.getModel()
        this.model.sync()
        this.model.belongsTo(chef['model'],{foreignKey:'chef_id'})
        this.model.belongsTo(district['model'],{foreignKey:'district_id'})
      //  this.model.hasOne(area['model'],{as:'area',foreignKey:'area_code'}) // add area_code to cityModel,这个在多的一端来维护
    }
}
module.exports = new CityModel()