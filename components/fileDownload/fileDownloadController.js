// const log4js = require('log4js');
const config = require('config');

// const logger = log4js.getLogger('controllers - fileDownloadController');
// logger.level = config.logLevel;

/**
 * Controller object
 */
const fileDownload = {};

fileDownload.getFile = async (req, res) => {
    // logger.debug('inside getFile()...');
    let path = 'uploads/' + req.params.filename
    res.download(path)
};

module.exports = fileDownload;