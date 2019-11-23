/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('t_chef_menu', {
    menu_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    menu_code: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
    },
    chef_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      references: {
        model: 't_chef',
        key: 'chef_id'
      }
    },
    menu_name: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    menu_name_font_id: {
      type: Sequelize.INTEGER(11),
      allowNull: true,
      references: {
        model: 't_font',
        key: 'font_id'
      }
    },
    menu_name_font_size: {
      type: Sequelize.INTEGER(2),
      allowNull: true
    },
    menu_name_font_style_code: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    menu_desc: {
      type: Sequelize.STRING(1000),
      allowNull: true
    },
    menu_desc_font_id: {
      type: Sequelize.INTEGER(11),
      allowNull: true,
      references: {
        model: 't_font',
        key: 'font_id'
      }
    },
    menu_desc_font_size: {
      type: Sequelize.INTEGER(2),
      allowNull: true
    },
    menu_desc_font_style_code: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    seq_no: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    start_date: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    end_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    applied_meal: {
      type: Sequelize.INTEGER(1),
      allowNull: false
    },
    child_meal: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    child_menu_note: {
      type: Sequelize.STRING(1000),
      allowNull: true
    },
    unit_price: {
      type: Sequelize.DECIMAL,
      allowNull: false
    },
    early_bird_unit_price: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    currency_code: {
      type: Sequelize.STRING(3),
      allowNull: true,
      references: {
        model: 't_currency',
        key: 'currency_code'
      }
    },
    instant_ind: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: '1'
    },
    min_pers: {
      type: Sequelize.INTEGER(4),
      allowNull: false,
      defaultValue: '1'
    },
    max_pers: {
      type: Sequelize.INTEGER(4),
      allowNull: true
    },
    menu_logo_url: {
      type: Sequelize.STRING(2000),
      allowNull: true
    },
    menu_background_url: {
      type: Sequelize.STRING(2000),
      allowNull: true
    },
    event_duration_hr: {
      type: Sequelize.DECIMAL,
      allowNull: false
    },
    chef_arrive_prior_hr: {
      type: Sequelize.DECIMAL,
      allowNull: false
    },
    preparation_days: {
      type: Sequelize.INTEGER(4),
      allowNull: true
    },
    preorder_days: {
      type: Sequelize.INTEGER(4),
      allowNull: true
    },
    public_ind: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: '0'
    },
    about: {
      type: Sequelize.STRING(4000),
      allowNull: true
    },
    cancel_policy: {
      type: Sequelize.STRING(4000),
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
    },
    parent_menu_id: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 't_chef_menu'
  });
};
