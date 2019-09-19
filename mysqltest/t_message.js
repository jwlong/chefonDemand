/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('t_message', {
    message_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    from_user_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: {
        model: 't_user',
        key: 'user_id'
      }
    },
    to_user_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: {
        model: 't_user',
        key: 'user_id'
      }
    },
    sys_message_ind: {
      type: Sequelize.STRING(1),
      allowNull: false
    },
    subject: {
      type: Sequelize.STRING(200),
      allowNull: false
    },
    message_body_html: {
      type: Sequelize.STRING(4000),
      allowNull: true
    },
    read_ind: {
      type: Sequelize.STRING(1),
      allowNull: false
    },
    create_on: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    create_by: {
      type: Sequelize.INTEGER(11),
      allowNull: true
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
    },
    parent_message_id: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 't_message'
  });
};
