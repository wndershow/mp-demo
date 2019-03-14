'use strict';
import http from '../utils/http';
import errorHandler from '../errorhandler/base_error_handler';
import regeneratorRuntime, { async } from '../vendor/runtime';

const textbooks_url = '/api/v1/textbooks';
const course_url = '/api/v1/courses';
const exercises_url = '/api/v1/exercises';

const app = getApp();

let textbook = {
  async getAll() {
    // 先读取缓存数据
    if (app.globalData.textbooks && app.globalData.textbooks.length > 0) {
      console.info('cache hit for $textbook.getAll()');
      return app.globalData.textbooks;
    }
    // 缓存未命中则请网络并更新缓存
    let textbooks = [];
    let textbooksRes = await http.get(textbooks_url);
    textbooks = textbooksRes.data.textbooks;
    app.globalData.textbooks = textbooks;
    return textbooks;
  },
  async getCourseUnits(courseId) {
    if (app.globalData.courseUnits && app.globalData.courseUnits[courseId]) {
      console.info(
        `course units cache hit for $textbook.getCourseUnits(${courseId})`
      );
      return app.globalData.courseUnits[courseId];
    }
    let unitsRes = await http.get(`${course_url}/${courseId}/units`);
    let courseUnits = unitsRes.data;
    if (!app.globalData.courseUnits) {
      app.globalData.courseUnits = [];
    }
    let globalCourseUnits = app.globalData.courseUnits;
    globalCourseUnits[courseId] = courseUnits;
    app.globalData.courseUnits = globalCourseUnits;
    return courseUnits;
  },
  async getExercisesByUnits(exerciseType, unitIds, lessonIds) {
    if (!exerciseType) {
      throw new Error('exercise type is required to fetch exercises.');
    }
    if (!unitIds && !lessonIds) {
      throw new Error('unit id or lesson id is required to fetch exercise.');
    }
    let url = exercises_url;
    if (unitIds && unitIds.length > 0) {
      url = `${url}?exerciseType=${exerciseType}&unitIds=${unitIds.join(',')}`;
    } else if (lessonIds && lessonIds.length > 0) {
      url = `${url}?exerciseType=${exerciseType}&lessonIds=${lessonIds.join(
        ','
      )}`;
    } else {
      throw new Error('unit id or lesson id is required to fetch exercise.');
    }
    let exercisesRes = await http.get(url);
    return exercisesRes.data.exercises;
  },
  async getExercises(exerciseIds) {
    if (app.globalData.exercises) {
      let exercises = app.globalData.exercises[exerciseIds.join(',')];
      if (exercises && exercises.length > 0) {
        console.info(`cache hit for $textbook.getExercises(${exerciseIds})`);
        return exercises;
      }
    }
    let exercisesRes = await http.get(
      `${exercises_url}/${exerciseIds.join(',')}`
    );
    let exercises = exercisesRes.data.exercises;
    if (!app.globalData.exercises) {
      app.globalData.exercises = [];
    }
    app.globalData.exercises[exerciseIds.join(',')] = exercises;
    return exercises;
  }
};

export default textbook;
