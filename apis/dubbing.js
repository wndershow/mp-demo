import http from '../utils/http';
import regeneratorRuntime from '../vendor/runtime';
import $assignment from './assignment';
import $as from './assignment_submission';
import parseSRT from '../utils/parse-srt';
import precisionRound from '../utils/number';
import * as wechat from '../utils/wechat';
import CONFIG from '../config/index';

export const getTypes = async () => {
  let res = await http.get(`/api/v1/dubbing/types`);
  return res.data.types || [];
};

export const getMaterialByPage = async ({ pn = 1, ps = 20, sort = 'RELEASE_TIME_DESC', videoTypeId = 0, albumId = 0 }) => {
  let opts = { page: pn, size: ps, sort };
  if (videoTypeId) opts.videoTypeId = videoTypeId;
  if (albumId) opts.albumId = albumId;

  let res = await http.get(`/api/v1/dubbing/videos`, null, opts);
  let rows = res.data.results || [];
  let hasMore = rows.length == ps;
  return {
    pn,
    ps,
    hasMore,
    rows
  };
};

export const getVideo = async ({ id }) => {
  let res = await http.get(`/api/v1/dubbing/videos/${id}`);
  return res.data.video || null;
};

export const getClazzAssignment = async ({ clazzId, assignmentId }) => {
  let res = await $assignment.get({ clazzId, assignmentId });
  let ca = res.data.clazzAssignment || null;
  if (!ca || !ca.assignment.exercise.exerciseId) return ca;
  let eid = ca.assignment.exercise.exerciseId;
  let video = await getVideo({ id: eid });
  ca.assignment.exercise.video = video;
  return ca;
};
export const generateDubbing = async request => {
  let url = '/api/v1/dubbing/videoSynthesis';
  let res = await http.post(url, request);
  return res.data;
};
export const generateStatus = async ({ taskId }) => {
  let res = await http.get(`/api/v1/dubbing/videoSynthesis/?taskId=${taskId}`);
  return res.data;
};
export const getSubmission = async ({ assignmentId, clazzId, submissionId }) => {
  let t = {};
  let [submission, ca] = await Promise.all([$as.getDetail({ assignmentId, clazzId, submissionId }), getClazzAssignment({ assignmentId, clazzId })]);
  let assignment = ca.assignment || null;
  let clazz = ca.classz || null;
  let teacher = ca.teacher || null;
  submission.assignment = assignment;
  submission.clazz = clazz;
  submission.teacher = teacher;
  let exerciseSubmissions = submission.exerciseSubmissions || [];

  let exerciseSubmission = {};
  if (exerciseSubmissions.length) {
    exerciseSubmission = {
      dsrScore: exerciseSubmissions[0].dsrScore || 0,
      exerciseId: exerciseSubmissions[0].exerciseId || 0,
      exerciseType: exerciseSubmissions[0].exerciseType || '',
      videoUrl: (exerciseSubmissions[0].blocks[0] && exerciseSubmissions[0].blocks[0].videoUrl) || ''
    };
  }

  submission.exerciseSubmission = exerciseSubmission;
  return submission;
};

export const getSubtitles = async ({ subtitleUrl }) => {
  let subtitleRes = await http.get(subtitleUrl);
  let result = parseSRT(subtitleRes.data);
  let subtitles = result.map(subtitle => {
    let items = subtitle.text.split('<br />');
    let subtitleEn = items[0];
    let subtitleCn = items[1];
    let start = subtitle.start;
    let end = subtitle.end;
    let duration = precisionRound(end - start, 3);
    return {
      score: 0,
      recorded: false,
      isPlaying: false,
      isPlayingMy: false,
      preBlankTimeRange: 0,
      id: subtitle.id - 1,
      start: start,
      end: end,
      duration: duration,
      subtitleCn: subtitleCn,
      subtitleEn: subtitleEn
    };
  });
  if (subtitles.length > 0) {
    // 前面的空白时间
    subtitles.forEach((item, index) => {
      if (index === 0) {
        item['preBlankTimeRange'] = item.start;
      } else {
        let preBlankTimeRange = item.start - subtitles[index - 1].end;
        item['preBlankTimeRange'] = preBlankTimeRange;
      }
    });
  }
  return subtitles;
};

export const testVideoPart = async videoPartUrl => {
  // try {
  //   await http.head(videoPartUrl, {}, true);
  //   return true;
  // } catch (error) {
  //   console.error(error);
  //   return false;
  // }
  try {
    wx.showLoading({ title: '加载中...', mask: true });
    await wechat.downloadFile(videoPartUrl);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    wx.hideLoading();
  }
};
