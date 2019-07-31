/* jshint indent: 2 */

module.exports = function(sequelize, Sequelize) {
  return sequelize.define('t_chef_language', {
    chef_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 't_chef',
        key: 'chef_id'
      }
    },
    lang_code: {
      type: Sequelize.STRING(2),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 't_language',
        key: 'Language_Code'
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
      defaultValue: '0000-00-00 00:00:00'
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
    tableName: 't_chef_language'
  });
};
