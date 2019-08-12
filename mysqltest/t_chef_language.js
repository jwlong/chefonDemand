/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('t_chef_language', {
    chef_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 't_chef',
        key: 'chef_id'
      }
    },
    lang_code: {
      type: DataTypes.STRING(2),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 't_language',
        key: 'language_code'
      }
    },
    create_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    create_by: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    update_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    update_by: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    active_ind: {
      type: DataTypes.STRING(1),
      allowNull: false
    }
  }, {
    tableName: 't_chef_language'
  });
};
