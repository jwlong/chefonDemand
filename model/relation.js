/*//model之间的关系维护
import db from '../config/db'
var sequelize = db.sequelize();

var Province = sequelize.import('./province.js')

var Country = sequelize.import('./country.js')

//Province.hasOne(Country)
Province.belongsTo(Country,{foreignKey:'fk_country',target:'country_code'})

sequelize.sync();

exports.Province = Province;
exports.Country = Country;*/


