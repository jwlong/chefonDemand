/* jshint indent: 2 */

module.exports = function(sequelize, Sequelize) {
  return sequelize.define('t_cuisine_type', {
    cuisine_type_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    cuisine_type_name: {
      type: Sequelize.STRING(30),
      allowNull: false
    },
    Description: {
      type: Sequelize.STRING(4000),
      allowNull: false
    },
    orgin_country: {
      type: Sequelize.STRING(3),
      allowNull: true
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
    tableName: 't_cuisine_type'
  });
};
