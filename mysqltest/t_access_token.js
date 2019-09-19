/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('t_access_token', {
    token_id: {
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
    token_string: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
    },
    valid_until: {
      type: Sequelize.DATE,
      allowNull: true
    },
    ipv4_address: {
      type: Sequelize.STRING(15),
      allowNull: false
    },
    for_order: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    refresh_token: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
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
    active_ind: {
      type: Sequelize.STRING(1),
      allowNull: false
    }
  }, {
    tableName: 't_access_token'
  });
};
