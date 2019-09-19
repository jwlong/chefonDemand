/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('t_user', {
    user_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true
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
      defaultValue: '0'
    },
    accept_terms_ind: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: '0'
    },
    robot_ind: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: '0'
    },
    ipv4_address: {
      type: Sequelize.STRING(15),
      allowNull: false
    },
    photo_url: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    verified_email: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: '0'
    },
    verified_email_on: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    verified_contact_no: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: '0'
    },
    verified_contact_no_on: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    verified_user_information: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: '0'
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
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    create_by: {
      type: Sequelize.INTEGER(11),
      allowNull: true
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
    tableName: 't_user'
  });
};
