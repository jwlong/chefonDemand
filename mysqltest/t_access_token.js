/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('t_access_token', {
    token_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 't_user',
        key: 'user_id'
      }
    },
    token_string: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    valid_until: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ipv4_address: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    for_order: {
      type: DataTypes.BOOLEAN,
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
    }
  }, {
    tableName: 't_access_token'
  });
};
