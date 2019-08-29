import Sequelize from 'Sequelize'
import BaseModel from './baseModel.js'
import moment from 'moment'
import bcrypt from "bcrypt"

class User extends BaseModel {
    constructor () {
        super('t_user', {
            user_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true,
                autoIncrement:true
            },
            user_name: {
                type: Sequelize.STRING(45),
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            salutation: {
                type: Sequelize.STRING(10),
                allowNull: false
            },
            first_name: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            middle_name: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            last_name: {
                type: Sequelize.STRING(50),
                allowNull: true
            },
            email_address: {
                type: Sequelize.STRING(45),
                allowNull: true
            },
            contact_no: {
                type: Sequelize.STRING(15),
                allowNull: true
            },
            sms_notify_ind: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: '0'
            },
            birthday: {
                type: Sequelize.DATEONLY,
                allowNull: true
            },
            address_1: {
                type: Sequelize.STRING(200),
                allowNull: true
            },
            address_2: {
                type: Sequelize.STRING(200),
                allowNull: true
            },
            address_3: {
                type: Sequelize.STRING(200),
                allowNull: true
            },
            accept_marketing_ind: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            accept_terms_ind: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            robot_ind: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false,
            },

            ipv4_address: {
                type: Sequelize.STRING(15),
                allowNull: false
            },
            verified_email: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue:false
            },
            verified_email_on: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            verified_contact_no: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            verified_contact_no_on: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            verified_user_information: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: false
            },
            verified_user_information_on: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            rating_level: {
                type: Sequelize.INTEGER(1),
                allowNull: true
            },
            create_on: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            create_by: {
                type: Sequelize.INTEGER(11),
                allowNull: true
            },
            update_on: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            update_by: {
                type: Sequelize.INTEGER(11),
                allowNull: false
            },
            photo_url: {
                type: Sequelize.STRING(200),
                allowNull: true
            },
            active_ind: {
                type: Sequelize.STRING(1),
                allowNull: false
            }
        }, {
            tableName: 't_user',
            timestamps: false,
            hooks: {
                beforeCreate: user => {
                    const salt = bcrypt.genSaltSync();
                    user.password = bcrypt.hashSync(user.password, salt);
                    user.update_on = new Date();
                    user.create_on = new Date();
                },
                beforeBulkUpdate:user =>{
                    if (user.attributes.password) {
                        const salt = bcrypt.genSaltSync();
                        user.attributes.password = bcrypt.hashSync(user.attributes.password, salt);
                    }
                }
            }
        })
        this.model = super.getModel()
        //this.model.sync()
    }
    isPassword (encodedPassword, password){
        console.log(bcrypt.compareSync(password, encodedPassword))
        return bcrypt.compareSync(password, encodedPassword);
    };
}
module.exports = new User()