/* jshint indent: 2 */

module.exports = function(sequelize, Sequelize) {
  return sequelize.define('t_province', {
    province_code: {
      type: Sequelize.STRING(5),
      allowNull: false,
      primaryKey: true
    },
    province_name: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    country_code: {
      type: Sequelize.STRING(3),
      allowNull: false,
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
    tableName: 't_province'
  });
};
