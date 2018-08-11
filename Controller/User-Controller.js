var UserModel = require("./../Models/User")
var shortid = require('shortid')
var response = require('./../Libraries/response')
var encrypt = require('./../Libraries/encrypt')
var validate = require('./../Libraries/validateLib')
var bookModel = require('./../Models/Books')

let getAllBooks = (req, res) => {
    console.log(req.params.id)
    bookModel.find({ userId: req.params.id }, (err, result) => {
        if (err) {
            let apiResponse = response.generate("true", "Error Occured While Finding", 500, null)
            res.send(apiResponse)
        }
        else if (result == undefined || result == "" || result == null) {
            let apiResponse = response.generate("true", "Empty Book List", 500, null)
            res.send(apiResponse)
        }
        else {
            let apiResponse = response.generate("false", "Books Found", 200, result)
            res.send(apiResponse)
        }
    })
}
let addtoFavorites = (req, res) => {
    console.log(req.body)
    bookModel.findOne({ bookId: req.body.bookId }, (err, result) => {
        if (err) {
            let apiResponse = response.generate("true", "Error Occured While Finding", 500, null)
            res.send(apiResponse)
        }
        else if (result == undefined || result == "" || result == null) {
            let newBook = new bookModel({
                userId: req.body.userId,
                bookId: req.body.bookId,
                bookName: req.body.bookName
            })
            newBook.save((err, result) => {
                if (err) {

                    let apiResponse = response.generate("true", "Error Occured While Saving", 500, null)
                    res.send(apiResponse)
                }
                else {
                    let apiResponse = response.generate("false", "Added To Favorites", 200, result)
                    res.send(apiResponse)
                }
            })
        }
        else {
            let apiResponse = response.generate("false", "Book Already Added To Favorites", 302, result)
            res.send(apiResponse)
        }
    })
}


let removefromFavorites = (req, res) => {
    bookModel.remove({ "bookId": req.params.id }, (err, result) => {
        if (err) {
            let apiResponse = response.generate("true", "Error Occured", 500, null)
            res.send(apiResponse)
        }
        else {
            let apiResponse = response.generate("false", "Removed From Favorites", 200, result)
            res.send(apiResponse)
        }
    })
}

//Sign-UP Function:

let signupFunction = (req, res) => {

    let validateUserInput = () => {
        return new Promise((resolve, reject) => {

            if (req.body.email) {
                if (!validate.email(req.body.email)) {
                    let apiResponse = response.generate("true", "Email Does Not Meet Requirement", 500, null)
                    reject(apiResponse)
                }
                else if (req.body.password == null || req.body.password == '' || req.body.password == undefined) {
                    let apiResponse = response.generate("true", "Enter Your Password", 500, null)
                    reject(apiResponse)
                }
                else {
                    resolve(req)
                }
            }
            else {
                let apiResponse = response.generate("true", "Email Parameter Is Missing", 500, null)
                reject(apiResponse)
            }
        })
    }

    let createUser = (req, res) => {
        return new Promise((resolve, reject) => {
            UserModel.findOne({ email: req.body.email }, (err, userDetails) => {
                if (err) {
                    let apiResponse = response.generate("true", "Failed To Find User Details", 500, null)
                    reject(apiResponse)
                }
                else if (userDetails == null || userDetails == undefined || userDetails == "") {
                    let newUser = new UserModel({
                        userId: shortid.generate(),
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email.toLowerCase(),
                        phone: req.body.phone,
                        password: encrypt.hashPassword(req.body.password)
                    })
                    newUser.save((err, result) => {
                        if (err) {
                            let apiResponse = response.generate("true", "Error Occured While Saving Data", 500, null)
                            reject(apiResponse)
                        }
                        else {
                            let userObject = result.toObject()
                            resolve(userObject)
                        }
                    })

                }
                else {
                    let apiResponse = response.generate("true", "User With Email Already Exists", 500, null)
                    reject(apiResponse)
                }
            })
        })
    }

    validateUserInput(req, res).then(createUser).then((resolve) => {
        delete resolve.password
        let apiResponse = response.generate("false", "User Created", 200, resolve)
        res.send(apiResponse)
    }).catch((error) => {
        res.send(error)
    })
}

//Login Function:

let loginFunction = (req, res) => {
    let findUser = () => {
        return new Promise((resolve, reject) => {
            if (req.body.email) {
                console.log("Email is There")
                UserModel.findOne({ email: req.body.email }, (err, personDetails) => {
                    if (err) {
                        let apiResponse = response.generate("true", "Error Occured", 500, null)
                        reject(apiResponse)
                    }
                    else if (personDetails == null || personDetails == undefined || personDetails == "") {
                        let apiResponse = response.generate("true", "Email Not Registered", 404, null)
                        reject(apiResponse)
                    }
                    else {
                        console.log(personDetails)
                        resolve(personDetails)
                    }

                })
            }
        })
    }
    let validatePassword = (personDetails) => {

        return new Promise((resolve, reject) => {
            encrypt.comparePassword(req.body.password, personDetails.password, (err, isMatch) => {
                if (err) {
                    let apiResponse = response.generate("true", "Password Error", 400, null)
                    reject(apiResponse)
                }
                else if (isMatch) {
                    let personDetailsObj = personDetails.toObject();
                    delete personDetailsObj.password;
                    delete personDetailsObj._id;
                    delete personDetailsObj.__v;
                    resolve(personDetailsObj)
                }
                else {
                    let apiResponse = response.generate("true", "Wrong Password", 400, null)
                    reject(apiResponse)
                }
            })
        })
    }
    findUser(req, res).then(validatePassword).then((resolve) => {
        let apiResponse = response.generate("false", "Login Successfull", 200, resolve)
        res.send(apiResponse)
    }).catch((err) => {
        console.log(err)
        res.send(err)
    })
}

module.exports = {
    loginFunction: loginFunction,
    signupFunction: signupFunction,
    addtoFavorites: addtoFavorites,
    removefromFavorites: removefromFavorites,
    getAllBooks: getAllBooks
}