const ENV = 'dev';

import dev from './dev.env';
import beta from './beta.env';
import staging from './staging.env';
import prod from './prod.env';

let config = {
  env: '',
  aws: {
    s3DownloadUrl: 'https://web-s3.saybot.net/public'
  },
  fundebug: {
    apikey: '0133fddd1ede0c53144e32c9b9418c093bb839f8f22224c45d0981a4ba24e2bf'
  }
};
if (ENV === 'dev') {
  config = { ...dev };
} else if (ENV === 'beta') {
  config = { ...beta };
} else if (ENV === 'staging') {
  config = { ...staging };
} else if (ENV === 'prod') {
  config = { ...prod };
}

config.env = ENV;

export default config;
