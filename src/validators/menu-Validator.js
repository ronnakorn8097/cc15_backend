const joi = require('joi');

const checkMenuIdSchema = joi.object({
    id : joi.number().integer().positive().required(),
    name : joi.string(),
    price: joi.string(),
    status : joi.valid("AVAILIABLE","UNAVAILABLE"),
    detail : joi.string(),
    menuImage : joi.string()
});

exports.checkMenuIdSchema = checkMenuIdSchema;


const checkMenuIdForDelete = joi.object({
    deleteMenu : joi.number().integer().positive().required()
})

exports.checkMenuIdForDelete = checkMenuIdForDelete;

