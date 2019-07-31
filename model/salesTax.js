import Sequelize from 'sequelize'
import BaseModel from './baseModel.js'
import province from  './province'
import moment from 'moment'
class SalesTax extends BaseModel {
    constructor () {
        super('t_sales_tax', {
            sales_tax_id: {
                type: Sequelize.INTEGER(11),
                allowNull: false,
                primaryKey: true
            },
            sales_tax_name: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            display: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            sales_tax_rate: {
                type: Sequelize.DECIMAL,
                allowNull: false
            },
            province_code: {
                type: Sequelize.STRING(5),
                allowNull: true
            },
            country_code: {
                type: Sequelize.STRING(3),
                allowNull: true
            },
            Create_On: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                get() {
                    return moment(this.getDataValue('Create_On')).format('DD/MM/YYYY HH:mm:ss');
                }
            },
            Create_By: {
                type: Sequelize.INTEGER(11),
                allowNull: false
            },
            Update_On: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
                get() {
                    return moment(this.getDataValue('Update_On')).format('DD/MM/YYYY HH:mm:ss');
                }
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
            tableName: 't_sales_tax',
            timestamps: false,
        });
        this.model = super.getModel()
    }
}
module.exports = new SalesTax()