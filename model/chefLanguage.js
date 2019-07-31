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
                    key: 'Language_Code'
                }
            },
            Create_On: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                get() {
                    return moment(this.getDataValue('Create_On')).format('DD/MM/YYYY HH:mm:ss');
                }
            },
            Create_By: {
                type: Sequelize.INTEGER(11),
                allowNull: false
            },
            Update_On: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: '0000-00-00 00:00:00',
                get() {
                    return moment(this.getDataValue('Update_On')).format('DD/MM/YYYY HH:mm:ss');
                }
            },
            Update_By: {
                type: Sequelize.INTEGER(11),
                allowNull: false
            },
            Active_Ind: {
                type: Sequelize.STRING(1),
                allowNull: false
            }
        }, {
            tableName: 't_chef_language',
            timestamps: false,
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