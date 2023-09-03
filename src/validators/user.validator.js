import Joi from '@hapi/joi';

export const newUserValidator = (req, res, next) => {
  const schema = Joi.object({
    fName: Joi.string().min(4).required(),
    lName: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });
  const { error, value } = schema.validate(req.body);
  if (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: `${error}`
    });
  } else {
    next();
  }
};

