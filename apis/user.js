'use strict';
import regeneratorRuntime from '../vendor/runtime';
import http from '../utils/http';
import config from '../config/index';
import userUtils from '../utils/userUtils';

const user = {
  update: async function(userInfo, role) {
    let gender = genderValue => {
      if (typeof genderValue === 'number') {
        return genderValue === 1 ? 'MALE' : 'FEMALE';
      } else if (typeof genderValue === 'string') {
        return genderValue;
      }
    };
    let updateUserInfoRequest = {
      name: userInfo.name,
      role: role,
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl,
      gender: gender(userInfo.gender),
      country: userInfo.country,
      province: userInfo.province,
      city: userInfo.city,
      language: userInfo.language,
      phone: userInfo.phone
    };
    console.info(`user info to be updated:\n ${JSON.stringify(updateUserInfoRequest)}`);
    let res = await http.put('/api/v1/users/me', updateUserInfoRequest);
    userUtils.clearLoggedUserCache();
    return res;
  },
  async switchRoleToStudent() {
    return await this.switchRole('STUDENT');
  },
  async switchRoleToTeacher() {
    return await this.switchRole('TEACHER');
  },
  async switchRole(changedRole) {
    let res = await http.put(`/api/v1/users/me`, { role: changedRole });
    userUtils.clearLoggedUserCache();
    return res;
  },
  takeAssignment({ assignmentId, clazzId }) {
    return http.post('/api/v1/users/me/assignments', { assignmentId, classId: clazzId });
  }
};

export default user;
