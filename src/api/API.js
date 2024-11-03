import axios from 'axios';
import {store} from '../redux/store/index';
import {Endpoints} from '../utils';

export const api = (method, endpoint, body) => {
  const state = store.getState();
  const {ipAddress} = state.Auth;
  const {host, username, password, port, database} = state.ConnectionString;
  const language = state.Locale.language;

  return new Promise((resolve, reject) => {
    console.log("connection",state.ConnectionString);
    if (!host || !username || !password || !port || !database) {
      reject('Kindly connect the database first');
    } else if (!ipAddress) {
      reject('IP Address is not configured');
    } else {
      const url = `http://${ipAddress}:3000/${endpoint}`;
      const connectionString = `mysql://root:crmsrv@12A@${host}:${port}/${database}`;
      console.log(`${method} -- ${url} -- ${connectionString}`);

      axios({
        method: method,
        url: url,
        data: body,
        timeout: endpoint === Endpoints.login ? 5000 : 60000,
        headers: {
          'connection-string': encodeURIComponent(connectionString),
          'accept-language': language
        },
      })
        .then(res => {
          if (res.data.success) resolve(res);
          else {
            const errorObject = {
              code: 200,
              message: res.data.message,
            };
            reject(errorObject);
          }
        })
        .catch(err => {
          const errorObject = {
            code: err.response ? err.response.status : 404,
            message:
              err.response && err.response.data && err.response.data.message
                ? err.response.data.message
                : err.message,
          };
          reject(errorObject);
        });
    }
  });
};
