/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('t_chef_default_schedule', {
    chef_default_scheule_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    chef_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 't_chef',
        key: 'chef_id'
      }
    },
    mon: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    tue: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    wed: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    thu: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    fri: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    sat: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    sun: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    holiday: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    apply_meal: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '3'
    },
    instant_ind: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: '1'
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
    tableName: 't_chef_default_schedule'
  });
};
