/* jshint indent: 2 */

module.exports = function(sequelize, Sequelize) {
  return sequelize.define('t_district', {
    District_Code: {
      type: Sequelize.STRING(5),
      allowNull: false,
      primaryKey: true
    },
    District_Name: {
      type: Sequelize.STRING(80),
      allowNull: false
    },
    City_Code: {
      type: Sequelize.STRING(5),
      allowNull: true,
      references: {
        model: 't_city',
        key: 'City_Code'
      }
    },
    Province_Code: {
      type: Sequelize.STRING(5),
      allowNull: true
    },
    Country_Code: {
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
    tableName: 't_district'
  });
};
