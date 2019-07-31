/* jshint indent: 2 */

module.exports = function(sequelize, Sequelize) {
  return sequelize.define('t_chef_menu', {
    menu_id: {
      type: Sequelize.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    chef_id: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    cusine_type: {
      type: Sequelize.STRING(5),
      allowNull: true
    },
    unit_price: {
      type: Sequelize.DECIMAL,
      allowNull: true
    },
    min_guest: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    max_guest: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    meal_courses: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    event_duration_hr: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    chef_arrival_time: {
      type: Sequelize.DATE,
      allowNull: true
    },
    advance_booking_days: {
      type: Sequelize.INTEGER(11),
      allowNull: true
    },
    kid_menu: {
      type: Sequelize.BOOLEAN,
      allowNull: true
    },
    desc: {
      type: Sequelize.STRING(100),
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
    },
    Update_On: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    },
    Update_By: {
      type: Sequelize.INTEGER(11),
      allowNull: false
    },
    Active_Ind: {
      type: Sequelize.STRING(1),
      allowNull: false
    }
  }, {
    tableName: 't_chef_menu'
  });
};
