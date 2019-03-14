import regeneratorRuntime from '../vendor/runtime';
import http from '../utils/http';
import userUtils from '../utils/userUtils';

export default {
  getMyClasses() {
    return http.get(`/api/v1/classes`);
  },
  getById(cid, withMembers = true) {
    return http.get(`/api/v1/classes/${cid}${withMembers ? '?fields=members' : ''}`);
  },
  getMembersById(cid) {
    return http.get(`/api/v1/classes/${cid}/members`);
  },
  updateUserName(classId, userName) {
    userUtils.clearClazzUserNamesCache();
    let updateNameRequest = {
      userName: userName
    };
    return http.put(`/api/v1/users/me/classes/${classId}`, updateNameRequest);
  },
  async join({ cid, studentName }) {
    await http.post(`/api/v1/users/me/classes`, {
      classId: cid,
      name: studentName
    });
    return true;
  }
};
