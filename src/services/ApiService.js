import {api} from '../api/API';

export default {
  post: (endpoint, body) => {
    return new Promise((resolve, reject) => {
      api('post', endpoint, body)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          console.log(err);
          reject(err);
        });
    });
  },
  get: (endpoint, id = '') => {
    return new Promise((resolve, reject) => {
      api('get', endpoint + id, null)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  patch: (endpoint, body, id = '') => {
    return new Promise((resolve, reject) => {
      api('patch', endpoint + id, body)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  delete: (endpoint, id) => {
    return new Promise((resolve, reject) => {
      api('delete', endpoint + id, null)
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
};
