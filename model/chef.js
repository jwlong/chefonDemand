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
                allowNull: false,
                primaryKey: true,
                references: {
                    model: 't_user',
                    key: 'user_id'
                }
            },
            short_desc: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            detail_desc: {
                type: Sequelize.STRING(4000),
                allowNull: true
            },
            verified_chef_ind: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: '0'
            },
            food_safety_certified_ind: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: '0'
            },
            payment_protection_ind: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: '0'
            },
            verified: {
                type: Sequelize.BOOLEAN,
                allowNull: true
            },
            verified_on: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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