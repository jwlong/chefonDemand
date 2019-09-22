import express from 'express'
import chefMenuService from "../service/chefMenuService";
import baseResult from "../model/baseResult";

const router = express.Router();

class MenuFoodSelectionCtroller {
    static initRouter() {
        router.post('/menu/cloneMenuByMenuId', async (req, res, next) => {
            let param = req.headers;
            if (param.menu_id || param.access_token || param.content_type) {
                throw baseResult.MENU_MENUID_TOKEN_CONTENT_TYPE_MANDATORY;
            }
            await chefMenuService.cloneMenuCheck(req.user_id, req.headers.menu_id);
            //clone next...

        });
        return router;
    }
}

module.exports = MenuFoodSelectionCtroller.initRouter();