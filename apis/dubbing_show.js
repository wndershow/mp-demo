'use strict';
import http from '../utils/http';
import regeneratorRuntime, { async } from '../vendor/runtime';
import * as $dubbing from './dubbing';
import CONFIG from '../config/index';
import parseSRT from '../utils/parse-srt';
import userUtils from '../utils/userUtils';

const dubbing_show_users_url = '/api/v2/dubbingShow/users';
const dubbing_show_submissions_url = '/api/v2/dubbingShow/submissions';
let Grades = [];
let Ins = null;

let dubbingShow = {
  post(institutionId) {
    let url = `${dubbing_show_users_url}/me`;
    let params = {
      institutionId: institutionId
    };
    return http.post(url, params);
  },
  get() {
    let url = `${dubbing_show_users_url}/me?expands=institution`;
    return http.get(url);
  },
  async getDubbingTotalCount() {
    let url = `${dubbing_show_submissions_url}?expands=totalCount`;
    let res = await http.get(url);
    return res.data.totalCount;
  },
  async submissions(submissions) {
    let request = {
      dubbingVideoUrl: submissions.videoUrl, //用户配音视频地址
      score: submissions.dsrScore, //得分
      videoCoverUrl: submissions.coverUrl, //视频封面URL
      videoId: submissions.videoId, //视频素材id
      videoTitle: submissions.videoTitle, //视频素材title
      videoSentenceCount: submissions.videoSentenceCount, //视频长度
      videoDifficulty: submissions.videoDifficulty //视频难度
    };
    return http.post(dubbing_show_submissions_url, request);
  },
  async workScorePage(id) {
    let url = `${dubbing_show_submissions_url}/${id}?expands=user,isCurrentUserSubmission,currentUserSubmission`;
    let res = await http.get(url);
    return res.data;
  }
};

export const createOrModifyRegistInfo = async ({ name, phone, schoolId, gradeId }) => {
  let res = await http.put(`/api/v2/dubbingShow/users/me`, {
    gradeId,
    name,
    phone,
    schoolId
  });
  return true;
};

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

const getAreaName = async (institutionId, schoolId) => {
  let ins = await getInstitutionById(institutionId);
  if (!ins) return '';
  let schoolName = '';
  for (let school in ins.schools) {
    if (school.id != schoolId) continue;
    schoolName = school.name;
    break;
  }
  return ins.name + ' ' + schoolName;
};

const getGradeName = async gradeId => {
  let grades = await getGrades();
  let gradeName = '';
  grades.forEach(n => {
    if (n.id != gradeId) return;
    gradeName = n.name;
  });
  return gradeName;
};

export const getInstitutionById = async id => {
  if (Ins) return Ins;
  let res = await http.get(`/api/v2/institutions/${id}`, null);
  let t = res.data.institution || null;
  Ins = t;
  return t;
};

export const getGrades = async () => {
  if (Grades.length) return Grades;
  let res = await http.get(`/api/v2/grades`, null);
  let t = res.data.results || [];
  Grades = t;
  return t;
};

export const getAlbums = async () => {
  let albums = [];
  let dubbingAlbums = CONFIG.dubbingAlbums;
  for (let albumId in dubbingAlbums) {
    albums.push({
      id: Number(albumId),
      name: dubbingAlbums[albumId]
    });
  }
  return albums;
};

export const getBanners = async () => {
  let res = await http.get(`/api/v2/dubbingShow/banners`, null);
  let banners = res.data.results || [];
  return banners;
};
/**
 * 获取首页推荐素材
 *
 * @return {Promise} [description]
 */
export const getHomeRecommendMaterails = async () => {
  let rs = await $dubbing.getMaterialByPage({
    ps: CONFIG.dubbingShow.homePageRecommendNum,
    albumId: CONFIG.dubbingShow.homePageRecommendAlbumId
  });
  return rs.rows || [];
};

export const getMyShows = async ({ expands = `highestHistory,totalCount,isCurrentUserSubmissions`, page = 1, size = 2, userId = 0 }) => {
  let opts = { expands, page, size };
  if (userId) opts.userId = userId;
  let res = await http.get(`/api/v2/dubbingShow/users/${userId}/submissions`, null, opts);
  let t = res.data || null;
  return t;
};

export const getMySubmissionByVideoId = async videoId => {
  let { id = 0 } = userUtils.cgetCurrentLoggedUser();
  if (!id) return null;
  let userId = id;
  let opts = { expands: ``, page: 1, size: 1, userId, videoId };
  let res = await http.get(`/api/v2/dubbingShow/users/${userId}/submissions`, null, opts);
  let submission = res.data && res.data.results.length ? res.data.results[0] : null;
  return submission;
};

export default dubbingShow;
