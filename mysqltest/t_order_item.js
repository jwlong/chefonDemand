/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('t_order_item', {
    order_item_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    order_guest_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    seq_no: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    menu_item_name: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    menu_item_desc: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    item_type_id: {
      type: Sequelize.INTEGER(11),
      allowNull: true,
      references: {
        model: 't_item_type',
        key: 'item_type_id'
      }
    },
    max_choice: {
      type: Sequelize.INTEGER(5),
      allowNull: true
    },
    note: {
      type: Sequelize.STRING(2000),
      allowNull: true
    },
    optional: {
      type: Sequelize.BOOLEAN,
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
    act_ind: {
      type: Sequelize.STRING(1),
      allowNull: false
    }
  }, {
    tableName: 't_order_item'
  });
};
