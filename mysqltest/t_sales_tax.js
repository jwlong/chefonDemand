/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('t_sales_tax', {
    sales_tax_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    sales_tax_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    display: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    sales_tax_rate: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    province_code: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    country_code: {
      type: DataTypes.STRING(3),
      allowNull: true
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
    tableName: 't_sales_tax'
  });
};
