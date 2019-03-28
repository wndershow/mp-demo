'use strict';
import regeneratorRuntime from '../../vendor/runtime';

/**
 * [getRegistInfo description]
 * @return {Promise} [description]
 */
export const getRegistInfo = async () => {
  Grades = [];
  Ins = null;
  let res = await http.get(`/api/v2/dubbingShow/users/me`, null);
  let t = res.data || null;
  if (!t || !t.data) return t;
  t.data.areaName = await getAreaName(t.data.institutionId, t.data.schoolId);
  t.data.gradeName = await getGradeName(t.data.gradeId);
  return t;
};
