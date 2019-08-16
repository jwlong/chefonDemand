import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import  chef from './chef'
import language from './language'
import moment from 'moment'
class ChefLanguage extends BaseModel {
    constructor () {
        super('t_chef_language', {
            chef_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 't_chef',
                    key: 'chef_id'
                }
            },
            lang_code: {
                type: Sequelize.STRING(2),
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 't_language',
                    key: 'language_code'
                }
            },
            create_on: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            create_by: {
                type: Sequelize.INTEGER(11),
                allowNull: false
            },
            update_on: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            update_by: {
                type: Sequelize.INTEGER(11),
                allowNull: false
            },
            active_ind: {
                type: Sequelize.STRING(1),
                allowNull: false
            }
        }, {
            tableName: 't_chef_language',
            timestamp:false
        });
        this.model = super.getModel()
       // this.model.sync()
        this.model.belongsTo(chef['model'],{foreignKey:'chef_id'})
        this.model.belongsTo(language['model'],{foreignKey:'lang_code'})
    }
    getChefLangByChefId(attr) {
        return this.model.findAll({
            include:[{
                model:language['model'],
              //  where:{attr}
            },{
                model:chef['model'],
                where:attr
                }],

        })
    }
}
module.exports = new ChefLanguage()