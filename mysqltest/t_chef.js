/* jshint indent: 2 */

module.exports = function(sequelize, Sequelize) {
  return sequelize.define('t_chef', {
    chef_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 't_user',
        key: 'user_id'
      }
    },
    short_desc: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    detail_desc: {
      type: Sequelize.STRING(4000),
      allowNull: true
    },
    verified_chef_ind: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: '0'
    },
    food_safety_certified_ind: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: '0'
    },
    payment_protection_ind: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: '0'
    },
    verified: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    verified_on: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
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
    tableName: 't_chef'
  });
};
