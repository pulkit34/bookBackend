let generateResponse=(error,message,status,data)=>{
    let responseObject={
     error:error,
     message:message,
     status:status,
     data:data
    }
    return responseObject
}
module.exports={
    generate:generateResponse
}