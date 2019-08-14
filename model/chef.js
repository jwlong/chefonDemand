import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import db from '../config/db.js'
import moment from 'moment'
class Chef extends BaseModel {
    constructor () {
        super('t_chef', {
            chef_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true
            },
            user_id: {
                type: Sequelize.INTEGER(11),
                allowNull: true
            },
            First_Name: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            Middle_Name: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            Last_Name: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            Short_Desc: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            Detail_Desc: {
                type: Sequelize.STRING(4000),
                allowNull: true
            },
            verified: {
                type: Sequelize.BOOLEAN,
                allowNull: true
            },
            verified_on: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                get() {
                    return moment(this.getDataValue('verified_on')).format('DD/MM/YYYY HH:mm:ss');
                }
            },
            create_on: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                get() {
                    return moment(this.getDataValue('Create_On')).format('DD/MM/YYYY HH:mm:ss');
                }
            },
            create_by: {
                type: Sequelize.INTEGER(11),
                allowNull: false
            },
            update_on: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                get() {
                    return moment(this.getDataValue('Update_On')).format('DD/MM/YYYY HH:mm:ss');
                }
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
            tableName: 't_chef',
            timestamps: false,
        });
       // this.model.belongsToMany(language['model'],{through:'chef_language',as:'chef_language'})
        //this.model.belongsToMany(language['model'],{as:'langs',through:'chef_language',foreignKey:'chef_id'})
    }

   /* getChefList(attr) {
        console.log(attr);
        attr = {chef_id:attr.chef_id,first_name:(attr.first_name)?(attr.first_name): ''};
        return db.query('select c.first_name,c.last_name from chef  c left join chef_district d on d.chef_id = c.chef_id where c.chef_id= :chef_id and c.first_name = :first_name',{ replacements:attr,type:db.QueryTypes.SELECT});
    }*/
     getChefList(attr) {
     console.log(attr);
     attr = {chef_id:attr.chef_id,first_name:(attr.first_name)?(attr.first_name): ''};
     }
}
module.exports = new Chef()