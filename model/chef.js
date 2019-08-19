import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import chefLanguage from  './chefLanguage'
import chefCuisine from './chefCuisine'
import user from './user'
import experience from  './chefExperience'
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
                defaultValue: false
            },
            food_safety_certified_ind: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue:false
            },
            payment_protection_ind: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false
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
            photo_url: {
                type: Sequelize.STRING(300),
                allowNull: true
            },
            active_ind: {
                type: Sequelize.STRING(1),
                allowNull: false
            }
        }, {
            tableName: 't_chef',
            timestamps: false,
        });
        this.model = this.getModel();
        this.model.belongsTo(user['model'],{foreignKey: 'user_id'});
      //  this.model.hasMany(chefLanguage['model']);
       /* this.model.hasMany(experience['model']);
        this.model.hasMany(chefCuisine['model']);*/
       // this.model.belongsToMany(language['model'],{through:'chef_language',as:'chef_language'})
        //this.model.belongsToMany(language['model'],{as:'langs',through:'chef_language',foreignKey:'chef_id'})
    }

     getChefList(attr) {
     console.log(attr);
     attr = {chef_id:attr.chef_id,first_name:(attr.first_name)?(attr.first_name): ''};
     }
}
module.exports = new Chef()