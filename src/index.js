import { logger } from './app/logging.js';
import { web } from './app/web.js';

web.listen(5000, () => {
  logger.info('App start');
});
