class BaseService{
	constructor(instance){
		this.instance = instance
	}
	max (key) {
        let maxId = this.instance.max(key);
        if (!maxId) {
        	maxId = 0;
		}
		return maxId;
	}
	async getNextId(key) {
		return (await this.max(key))+1;
	}
	baseFindAll(attributes){
		return this.instance.findAll(attributes)
	}
	baseFindByFilter(attributes, where){
		return this.instance.findByFilter(attributes, where)
	}
	baseFindByFilterOrder(attributes, where, order){
		return this.instance.findByFilterOrder(attributes, where, order)
	}
	baseFindLikeByFilter(attributes, where){
		return this.instance.findLikeByFilter(attributes, where)
	}
	baseFindLikeByFilterOrder(attributes, where, order){
		return this.instance.findLikeByFilterOrder(attributes, where, order)
	}
	baseUpdate(attributes, where){
		return this.instance.update(attributes, where)
	}
	baseDelete(where){
		return this.instance.delete(where)
	}
	baseCreate(entity){
		return this.instance.create(entity)
	}
	baseCreateBatch(entitys){
		return this.instance.createBatch(entitys)
	}
	getModel() {
		return this.instance.model;
	}
}
module.exports = BaseService