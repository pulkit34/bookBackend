var bcrypt=require('bcryptjs')
var saltRounds=10
let hashPassword=(originalPassword)=>{
let hash=bcrypt.hashSync(originalPassword,saltRounds)
return hash
}
let comparePassword=(originalPassword,hashPassword,cb)=>{
bcrypt.compare(originalPassword,hashPassword,(err,result)=>{
    if(err){
        cb(err,null)
    }
    else{
        cb(null,result)
    }
})
}
module.exports={
    hashPassword:hashPassword,
    comparePassword:comparePassword
}