/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('t_city', {
    city_code: {
      type: Sequelize.STRING(5),
      allowNull: false,
      primaryKey: true
    },
    city_name: {
      type: Sequelize.STRING(30),
      allowNull: true
    },
    province_code: {
      type: Sequelize.STRING(5),
      allowNull: true,
      references: {
        model: 't_province',
        key: 'province_code'
      }
    },
    country_code: {
      type: Sequelize.STRING(3),
      allowNull: false
    },
    create_on: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    create_by: {
      type: Sequelize.INTEGER(11),
      allowNull: false
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
    tableName: 't_city'
  });
};
