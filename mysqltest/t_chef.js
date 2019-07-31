/* jshint indent: 2 */

module.exports = function(sequelize, Sequelize) {
  return sequelize.define('t_chef', {
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
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    Create_On: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    Create_By: {
      type: Sequelize.INTEGER(11),
      allowNull: false
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
    tableName: 't_chef'
  });
};
