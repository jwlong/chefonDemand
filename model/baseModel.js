import Sequelize from 'sequelize'
import db from '../config/db.js'
import utils from "../common/utils";
const Op = Sequelize.Op
class BaseModel{
	constructor(tableName, schema,config){
	/*	if (config && !config.hooks) {
			config.hooks = {
                beforeCreate: (records, {fields}) => {
                    // 做些什么
                    console.log("beforeCreate come in")
					utils.setCustomTransfer(records,'create')

                },
				beforeBulkCreate:(records, {fields}) => {
                    console.log("beforeBulkCreate come in")
					console.log(records)
				},
                beforeBulkUpdate: entity => {
                	console.log("beforeBulkUpdate come in")
                    utils.setGlobalTransfer(entity,'update')

				},
            }
		}*/
        //console.log(config)
		this.model = db.define(tableName, schema,config);
	}
	// 返回实例化的sequelize模型实例
	getModel(){
		return this.model
	}

    max(key,options) {
		//let nextId = 0;
		return this.model.max(key,options);
	}
	// schema 公共属性
	schemaPostProcessor(schema) {
		if (schema && schema.updateTime) {}
	}
	/**************************************查询方法**************************************/
	// 不带过滤条件的查询
	findAll(attributes){
		console.log(attributes);
		return attributes ? this.model.findAll({attributes: attributes}) : this.model.findAll()
/*		return db.query("select * from city",{
            type: db.QueryTypes.SELECT
        });*/

	}
	// 带过滤条件的精确查询
	findByFilter(attributes, where){
		return attributes ? this.model.findAll({attributes: attributes, where: where}) : this.model.findAll({where: where})
	}
	// 带过滤条件的排序精确查询
	findByFilterOrder(attributes, where, order){
		let orderOps = [[order, 'DESC']]
		return attributes ? this.model.findAll({attributes: attributes, where: where, order: orderOps}) : this.model.findAll({where: where, order: orderOps})
	}
	// 带过滤条件的模糊查询
	findLikeByFilter(attributes, where){
		let whereOps = {}
		for(let k in where){whereOps[k] = {[Op.like]: '%'+where[k]+'%'}}
		return attributes ? this.model.findAll({attributes: attributes, where: whereOps}) : this.model.findAll({where: whereOps})
	}
	// 带过滤条件的排序模糊查询
	findLikeByFilterOrder(attributes, where, order){
		let orderOps = [[order, 'DESC']]
		let whereOps = {}
		for(let k in where){whereOps[k] = {[Op.like]: '%'+where[k]+'%'}}
		return attributes ? this.model.findAll({attributes: attributes, where: whereOps, order: orderOps}) : this.model.findAll({where: whereOps, order: orderOps})
	}
	/**************************************更新方法**************************************/
	update(attributes, options){
		utils.setCustomTransfer(attributes,'update');
		return this.model.update(attributes,options)
	}

	/**************************************删除方法**************************************/
	// 条件删除
	delete(where,options){
		return this.model.destroy({where: where,options})
	}
	/**************************************插入方法**************************************/
	// 插入单个实体
	create(entity,options){
		utils.setCustomTransfer(entity,'create')
		return this.model.create(entity,options)
	}
	// 批量插入实体集
	createBatch(entitys){
		return this.model.bulkCreate(entitys)
	}

}
module.exports = BaseModel