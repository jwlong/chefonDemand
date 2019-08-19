import BaseService from './baseService.js'
import {AutoWritedChefExp} from '../common/AutoWrite.js'

@AutoWritedChefExp
class ChefExperienceService extends BaseService{
    constructor(){
        super(ChefExperienceService.model)
    }
}
module.exports = new ChefExperienceService()