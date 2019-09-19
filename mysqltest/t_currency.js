/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('t_currency', {
    currency_code: {
      type: Sequelize.STRING(3),
      allowNull: false,
      primaryKey: true
    },
    currency_name: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    currency_number: {
      type: Sequelize.INTEGER(3),
      allowNull: false
    },
    display_icon_url: {
      type: Sequelize.STRING(2000),
      allowNull: false
    },
    country_code: {
      type: Sequelize.STRING(5),
      allowNull: true,
      references: {
        model: 't_country',
        key: 'country_code'
      }
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
    tableName: 't_currency'
  });
};
