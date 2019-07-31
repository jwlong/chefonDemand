/* jshint indent: 2 */

module.exports = function(sequelize, Sequelize) {
  return sequelize.define('t_chef_service_location', {
    chef: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 't_chef',
        key: 'chef_id'
      }
    },
    district: {
      type: Sequelize.STRING(5),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 't_district',
        key: 'District_Code'
      }
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
    tableName: 't_chef_service_location'
  });
};
