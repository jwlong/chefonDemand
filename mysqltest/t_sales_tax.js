/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('t_sales_tax', {
    sales_tax_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    sales_tax_name: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    display: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    sales_tax_rate: {
      type: Sequelize.DECIMAL,
      allowNull: false
    },
    province_code: {
      type: Sequelize.STRING(5),
      allowNull: true
    },
    country_code: {
      type: Sequelize.STRING(3),
      allowNull: true
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
    tableName: 't_sales_tax'
  });
};
