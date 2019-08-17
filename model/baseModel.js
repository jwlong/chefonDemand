import Sequelize from 'sequelize'
import db from '../config/db.js'
const Op = Sequelize.Op
const  userContext = require('../common/userContext')
class BaseModel{
	constructor(tableName, schema,config){
		if (config && !config.hooks) {
			config.hooks = {
                beforeCreate: entity => {
                    // 做些什么
                    this.setCustomTransfer(entity,'create')

                },
                beforeBulkUpdate: entity => {
                    this.setCustomTransfer(entity,'update')

				}
            }
		}
        console.log(config)
		this.model = db.define(tableName, schema,config);

	}
	// 返回实例化的sequelize模型实例
	getModel(){
		return this.model
	}

    max(key) {
		//let nextId = 0;
		return this.model.max(key);
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
	// 当where为null则批量更新表；当where为条件则条件更新表
	update(attributes, where){
		if (attributes) {
			this.setCustomTransfer(attributes,'update');
		}
		return where ? this.model.update(attributes, {where: where}) : this.model.update(attributes, {where:{}})
	}
	/**************************************删除方法**************************************/
	// 条件删除
	delete(where){
		return this.model.destroy({where: where})
	}
	/**************************************插入方法**************************************/
	// 插入单个实体
	create(entity){
		return this.model.create(entity)
	}
	// 批量插入实体集
	createBatch(entitys){
		return this.model.bulkCreate(entitys)
	}
	setCustomTransfer(entity,type) {
		if (entity) {
            entity.update_on = new Date();
            if (userContext.userId) {
                entity.update_by = userContext.userId;
                if (type === 'create') {
                    entity.create_on = new Date();
                    entity.create_by = userContext.userId;
                }

            }else {
                entity.update_by = userContext.robot_id;
                entity.create_by = userContext.robot_id;
            }

            entity.active_ind = 'A';
        }

		return entity;
	}
}
module.exports = BaseModel