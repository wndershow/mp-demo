import regeneratorRuntime from '../vendor/runtime';
import http from '../utils/http';
import config from '../config/index';

export const getAuth = async () => {
  let res = await http.post(
    config.backendService.mjUrl,
    {
      query: `{
        getCosAuth {
          credentials {
            sessionToken
            tmpSecretId
            tmpSecretKey
          }
          expiredTime
        }
      }`
    },
    {
      Authorization: ''
    }
  );
  let rs = res.data.data.getCosAuth;
  let cosAuth = {
    sessionToken: rs.credentials.sessionToken,
    tmpSecretId: rs.credentials.tmpSecretId,
    tmpSecretKey: rs.credentials.tmpSecretKey,
    expiredTime: rs.expiredTime
  };
  return cosAuth;
};
