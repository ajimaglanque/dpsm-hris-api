const express = require('express');
// const log4js = require('log4js');
// const config = require('config');

const download = require('./fileDownloadController');

const router = express.Router();

/**
 * Set up logging

const logger = log4js.getLogger('routes - downloads');
logger.level = config.logLevel;

logger.debug('setting up /fileDownloadController route');
 */

/**
 * Add routes
 */
router.get('/:filename', download.getFile);

module.exports = router;
