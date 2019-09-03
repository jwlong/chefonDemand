import Sequelize from 'sequelize'
var configIndex =  require('./index');
var config = configIndex.mysql;
const sequelize = new Sequelize(
    config['database'],
    config['user'],
    config['pwd'],
    {
        dialect: 'mysql',host:config['host'],timezone: '+08:00',
        port:config['port'],
        pool: {
            max: 5,
            idle: 30000,
            acquire: 60000,
        }
    },
    )
sequelize.authenticate().then(() => {
    console.log('数据库连接成功...')
}).catch(err => {console.error('数据库连接失败...', err)})
module.exports = sequelize