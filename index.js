var express=require('express')
var config=require('./App-Configuration/config')
var app=express()
var mongoose=require('mongoose')
var route=require('./Routing/router')
var bodyParser = require("body-parser")

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.use(function(req,res,next){
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Methods","GET,POST,PUT,DELETE,OPTIONS")
    res.header("Access-Control-Allow-Headers","Origin,X-Requested-With,Content-Type,Accept")
    next();
})
mongoose.connect(config.configuration.db.uri)
mongoose.connection.on("open",function(err){
    if(err){
        console.log("Unable To Connect To Database")
    }
    console.log("Connection To Database Established")
})
route.setRouter(app)

app.listen(config.configuration.port,function(){
    console.log("Listening To Port 1100")
})