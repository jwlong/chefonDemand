/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('t_menu_item_option', {
    menu_item_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: {
        model: 't_menu_item',
        key: 'menu_item_id'
      }
    },
    option_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    seq_no: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    opt_txt: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    opt_txt_font_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: {
        model: 't_font',
        key: 'font_id'
      }
    },
    opt_txt_font_size: {
      type: Sequelize.INTEGER(2),
      allowNull: false
    },
    opt_txt_font_style_code: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    opt_desc: {
      type: Sequelize.STRING(1000),
      allowNull: true
    },
    opt_desc_font_id: {
      type: Sequelize.INTEGER(11),
      allowNull: true,
      references: {
        model: 't_font',
        key: 'font_id'
      }
    },
    opt_desc_font_size: {
      type: Sequelize.INTEGER(2),
      allowNull: true
    },
    opt_desc_font_style_code: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    opt_photo_url: {
      type: Sequelize.STRING(1000),
      allowNull: false
    },
    unit_price: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    currency_code: {
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
    tableName: 't_menu_item_option'
  });
};
