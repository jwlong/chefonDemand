class BaseService{
	constructor(instance){
		this.instance = instance
	}
	nextId(key,options) {
		return this.instance.max(key,options).then(maxId => {
			return maxId? maxId+1:1;
		})
	}

    /**
	 * options.attributes
	 * options.where
	 * options.transaction
     * @param options
     * @returns {*}
     */
	getOne(options) {
		return this.instance.getOne(options)
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
	baseUpdate(attributes, options){
		/*if (attributes) {
			attributes.update_on = new Date();
		}*/
		return this.instance.update(attributes, options)
	}
	baseDelete(where,options){
		return this.instance.delete(where,options)
	}
	baseCreate(entity,options){
		return this.instance.create(entity,options)
	}
	baseCreateBatch(entitys,options){
		return this.instance.createBatch(entitys,options)
	}
	getModel() {
		return this.instance.model;
	}
}
module.exports = BaseService