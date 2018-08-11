var config = require("./../App-Configuration/config")
var userController = require("./../Controller/User-Controller")
let setRouter = (app) => {
    let baseURL = config.configuration.apiVersion
    app.post(`${baseURL}/login`, userController.loginFunction)
    app.post(`${baseURL}/signup`, userController.signupFunction)
    app.post(`${baseURL}/adding`,userController.addtoFavorites)
    app.get(`${baseURL}/all/:id`,userController.getAllBooks)
    app.delete(`${baseURL}/remove/:id`,userController.removefromFavorites)
}
module.exports = {
    setRouter: setRouter
}