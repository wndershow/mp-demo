'use strict';
import http from '../utils/http';
import regeneratorRuntime, { async } from '../vendor/runtime';

const institutions_url = '/api/v2/institutions';
const app = getApp();

let institutions = {
  async get(id) {
    let url = `${institutions_url}/${id}`;
    let cachedInstitution = app.globalData.institution;
    if (cachedInstitution && id == cachedInstitution.id) {
      return cachedInstitution;
    } else {
      let res = await http.get(url);
      let institution = res.data.institution;
      if (institution) {
        app.globalData.institution = institution;
      }
      return institution;
    }
  }
};

export default institutions;
