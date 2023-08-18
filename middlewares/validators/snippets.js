const joi = require("joi");

const create = async (req, res, next) => {
  const schema = joi.object().keys({
    title: joi.string().required(),
    description: joi.string().required(),
    code: joi.string().required(),
    language: joi.string().required(),
  });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    logger.error(`Error validating create snippet payload : ${error}`);
    res.boom.badRequest(error.details[0].message);
  }
};

const update = async (req, res, next) => {
  const schema = joi.object().keys({
    title: joi.string().optional(),
    description: joi.string().optional(),
    code: joi.string().optional(),
    language: joi.string().optional(),
  });

  try {
    await schema.validateAsync(req.body);
    next();
  } catch (error) {
    logger.error(`Error validating create snippet payload : ${error}`);
    res.boom.badRequest(error.details[0].message);
  }
};

module.exports = {
  create,
  update,
};
