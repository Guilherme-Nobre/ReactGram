const { body } = require("express-validator");

const photoInsertValidation = () => {
    return [
        body("title")
        .not()
        .equals("undefined")
        .withMessage("O título é obrigatório")
        .isString()
        .withMessage("O título é obrigatório").isLength({min: 3})
        .withMessage("O título precisa ter no mínimo 3 caracteres."),
        body("image").custom((value, {req})=>{
            if (!req.file){
                throw new Error("A imagem é obrigatória.")
            }
            return true;
        })
    ]
};

const photoUpdateValidation = () => {
    return [
        body("title")
        .not()
        .equals("undefined")
        .withMessage("O título é obrigatório")
        .isString()
        .withMessage("O título é obrigatório")
        .isLength({min: 3})
        .withMessage("O título precisa ter no mínimo 3 caracteres.")
    ]
};

const commentValidation = () => {
    return [
        body("comment")
       .not()
       .equals("undefined")
       .withMessage("O comentário é obrigatório")
       .isString()
       .withMessage("O comentário é obrigatório")
       .isLength({min: 3})
       .withMessage("O comentário precisa ter no mínimo 3 caracteres.")
    ]
}

module.exports = {
    photoInsertValidation,
    photoUpdateValidation,
    commentValidation,
}