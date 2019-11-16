/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('t_user_menu_view', {
    view_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 't_user',
        key: 'user_id'
      }
    },
    menu_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 't_chef_menu',
        key: 'menu_id'
      }
    },
    viewed_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    create_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    create_by: {
      type: DataTypes.INTEGER(11),
      allowNull: true
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
    tableName: 't_user_menu_view'
  });
};
