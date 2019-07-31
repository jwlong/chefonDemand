/* jshint indent: 2 */
import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'

module.exports = function(sequelize, Sequelize) {
  return sequelize.define('t_access_token', {
    token_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    user_id: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    token_string: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    valid_until: {
      type: Sequelize.DATE,
      allowNull: true
    },
    ip_address: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    for_order: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    Create_On: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    Create_By: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    }
  }, {
    tableName: 't_access_token'
  });
};
