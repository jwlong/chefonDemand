/* jshint indent: 2 */

module.exports = function(sequelize, Sequelize) {
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
    email_address: {
      type: Sequelize.STRING(45),
      allowNull: false
    },
    contact_no: {
      type: Sequelize.STRING(15),
      allowNull: false
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
    Create_On: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    Create_By: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    Update_On: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
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
    tableName: 't_user'
  });
};
