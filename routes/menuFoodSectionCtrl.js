import express from 'express'
const router = express.Router();
class MenuFoodSelectionCtroller {
    static initRouter(){
        router.post('/menu/cloneMenuByMenuId');
        return router;
    }
}

module.exports = MenuFoodSelectionCtroller.initRouter();