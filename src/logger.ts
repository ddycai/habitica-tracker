import logger from 'loglevel';

if (process.env.NODE_ENV === 'development') {
  logger.setLevel("WARN");
} else {
  logger.setLevel("ERROR");
}

export default logger;