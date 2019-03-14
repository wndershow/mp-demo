'use strict';
import http from '../utils/http';
import $textbook from '../apis/textbook';
import regeneratorRuntime, { async } from '../vendor/runtime';

const assignments_url = '/api/v2/assignments';
const app = getApp();

let assignment = {
  create(createAssignmentRequest) {
    return http.post(assignments_url, createAssignmentRequest);
  },
  async list(isPublished, page) {
    return http.get(this.buildAssignmentsUrl(isPublished, page));
  },
  async getStatus(compositeIds) {
    if (!compositeIds || compositeIds.length === 0) {
      throw new Error('composite ids are required for getStatus api');
    }
    let url = `${assignments_url}/${compositeIds.join(',')}/submissions/status`;
    return http.get(url);
  },
  buildAssignmentsUrl(isPublished, page) {
    let url = assignments_url;
    let params = {};
    if (typeof isPublished === 'undefined') {
      isPublished = true;
    }
    params.isPublished = Boolean(isPublished);
    if (!page) {
      // set a default page
      page = {
        page: 1,
        size: 10
      };
    }
    if (!page.page) {
      page.page = 1;
    }
    if (!page.size) {
      page.size = 10;
    }
    params.page = page.page;
    params.size = page.size;
    url = url.concat('?');
    Object.keys(params).forEach(k => {
      url = url.concat(`${k}=${params[k]}&`);
    });

    console.debug(`assignments url:\n${url}`);
    return url;
  },
  get({ assignmentId, clazzId }) {
    if (!Number(assignmentId) || !Number(clazzId)) {
      throw new Error(`assignment id or clazz id is invalide: assignmentId[${assignmentId}, clazzId[${clazzId}]`);
    }
    let url = `${assignments_url}/${[assignmentId, clazzId].join('_')}`;
    return http.get(url);
  },
  /**
   * 具有cache功能的作业获取API
   *
   * @param {*} param0
   */
  async cget({ assignmentId, clazzId }) {
    let compositeId = [assignmentId, clazzId].join('_');
    let cachedClazzAssignments = app.globalData.clazzAssignments;
    if (cachedClazzAssignments) {
      let cached = cachedClazzAssignments.get(compositeId);
      if (cached) {
        console.info(`cache hit for clazzAssignment for composite id: ${compositeId}`);
        return cached;
      }
    }
    let clazzAssignmentRes = await this.get({ assignmentId, clazzId });
    let clazzAssignment = clazzAssignmentRes.data.clazzAssignment;
    if (clazzAssignment) {
      if (!cachedClazzAssignments) {
        cachedClazzAssignments = new Map();
      }
      cachedClazzAssignments.set(compositeId, clazzAssignment);
      app.globalData.clazzAssignments = cachedClazzAssignments;
    }
    return clazzAssignment;
  },
  async getAssignmentStats(assignmentCompositeIds) {
    let url = `${assignments_url}/${assignmentCompositeIds.join(',')}/submissions/statistics`;
    return http.get(url);
  },
  async getExercisesForPreview({ assignmentId, clazzId }) {
    let assignmentRes = await this.get({ assignmentId, clazzId });
    let assignment = assignmentRes.data.clazzAssignment.assignment;
    let selectedExerciseIds = [];
    let exerciseTypeMap = new Map();
    assignment.exercises.forEach(exercise => {
      selectedExerciseIds.push(exercise.exerciseId);
      exerciseTypeMap.set(exercise.exerciseId, exercise.exerciseType);
    });

    let exercises = await $textbook.getExercises(selectedExerciseIds);
    let selectedFlashcardExercises = [];
    let selectedReadaloudExercises = [];
    exercises.forEach(exercise => {
      let exerciseType = exerciseTypeMap.get(exercise.id);
      switch (exerciseType) {
        case 'FLASH_CARD':
          selectedFlashcardExercises.push(exercise);
          break;
        case 'READ_ALOUD':
          selectedReadaloudExercises.push(exercise);
          break;
        default:
          throw new Error(`unsupported exercise type: ${exercise.exerciseType}`);
      }
    });
    let exercisesForPreview = {
      selectedExerciseIds: selectedExerciseIds,
      selectedFlashcardExercises: selectedFlashcardExercises,
      selectedReadaloudExercises: selectedReadaloudExercises
    };
    return exercisesForPreview;
  },
  async classMemberSubmissions({ assignmentId, clazzId }) {
    let res = await http.get(`/api/v2/assignments/${assignmentId}_${clazzId}/classMemberSubmissions`);
    let submissions = res.data.results || [];
    return submissions;
  }
};

export default assignment;
