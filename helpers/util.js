// const log4js = require('log4js');
// const config = require('config');
const crypto = require('crypto');
const _ = require('lodash');
/**
 * Util object
 */
const util = {};


/**
 * Set up logging
 */
// const logger = log4js.getLogger('helpers - util');
// logger.level = config.logLevel;

/**
 * Send http response helper
 * res: express response object
 * msg: {statusCode (int), success (bool), message (string), etc}
 */
util.sendResponse = (res, msg) => {
  const response = msg;
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = response.statusCode;
  delete response.statusCode;

  if(response.error) {
    let error = response.error
    if(error.name == 'SequelizeValidationError') {
      let errorMessages = []
      let validatorArgs
      error.errors.forEach(e => {
        if(Array.isArray(e.validatorArgs) && e.validatorArgs.length) { 
          validatorArgs = e.validatorArgs[0]
        }
        errorMessages.push({
          name: error.name,
          message: e.message,
          acceptedValues: validatorArgs
        })
      })
      response.error = errorMessages
    } else if(error.name == 'SequelizeDatabaseError' || error.name == 'SequelizeUniqueConstraintError') {
      response.error = {
        name: error.name,
        message: error.parent.sqlMessage
      }
    }
  }

  res.json(response);
};

 util.getSalt =()=>{
  return crypto.randomBytes(16).toString('hex');
 };

 util.hashPassword = (pw, salt) => {
  const hash = crypto.pbkdf2Sync(pw, salt,
    1000, 64, `sha512`).toString(`hex`);
  return hash;
};

util.createRandomString = (length) => {
  let str = "";
  for (; str.length < length; str += Math.random().toString(36).substr(2));
  return str.substr(0, length).toUpperCase();
};

util.checkIfNull = (paramName) => {
  let paramValue;
  if(_.isNil(paramName) || _.isEmpty(paramName)) 
  {
    paramValue = "true";
  }else{
    paramValue = "false";
  }
  return paramValue;
};

module.exports = util;