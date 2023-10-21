const joi = require('joi');

const checkUserSchema = joi.object({
    id : joi.number().integer().positive().required(),
    username : joi.string(),
    password : joi.string(),
    firstName : joi.string(),
    lastName : joi.string(),
    status : joi.valid("AVAILIABLE","UNAVAILABLE"),
    userImage : joi.string(),
    role : joi.valid('ADMIN','STAFF')
})

exports.checkUserSchema = checkUserSchema;

const checkUserForDelete = joi.object({
    deleteUser : joi.number().integer().positive().required()
})

exports.checkUserForDelete = checkUserForDelete;