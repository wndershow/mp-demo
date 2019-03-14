'use strict';
import http from '../utils/http';
import blockUtils from '../utils/blockUtils';
import regeneratorRuntime, { async } from '../vendor/runtime';

const assignments_url = '/api/v2/assignments';

let assignmentSubmission = {
  url({ assignmentId, clazzId }) {
    return `${assignments_url}/${assignmentId}_${clazzId}/submissions`;
  },
  commentsUrl({ assignmentId, clazzId, submissionId }) {
    return `${this.url({ assignmentId, clazzId })}/${submissionId}/comments`;
  },
  create({ assignmentId, clazzId, exerciseId, textContent, blocks = [] }) {
    let contentBlocks = [];
    contentBlocks.push(
      { type: 'TEXT', text: textContent },
      ...blocks.map(blockUtils.convert2BackendBlock)
    );
    let createSubmissionRequest = {
      exerciseSubmissions: [
        {
          exerciseId,
          exerciseType: 'CUSTOMIZED',
          blocks: contentBlocks
        }
      ]
    };
    return http.post(
      this.url({ assignmentId, clazzId }),
      createSubmissionRequest
    );
  },
  async createContentGroupSubmission({
    assignmentId,
    clazzId,
    exerciseSubmissions
  }) {
    let createSubmissionRequest = {
      exerciseSubmissions
    };
    return http.post(
      this.url({ assignmentId, clazzId }),
      createSubmissionRequest
    );
  },
  async get({ assignmentId, clazzId }) {
    return http.get(this.url({ assignmentId, clazzId }));
  },
  async getDetail({ assignmentId, clazzId, submissionId }) {
    let detailRes = await http.get(
      `${this.url({ assignmentId, clazzId })}/${submissionId}`
    );
    return detailRes.data.assignmentSubmission;
  },
  async createComment({
    assignmentId,
    clazzId,
    submissionId,
    textContent,
    blocks = []
  }) {
    let contentBlocks = [];
    contentBlocks.push(
      { type: 'TEXT', text: textContent },
      ...blocks.map(blockUtils.convert2BackendBlock)
    );
    let createCommentRequest = {
      commentBlocks: contentBlocks
    };
    return http.post(
      this.commentsUrl({ assignmentId, clazzId, submissionId }),
      createCommentRequest
    );
  },
  getComments({ assignmentId, clazzId, submissionId }) {
    return http.get(this.commentsUrl({ assignmentId, clazzId, submissionId }));
  }
};

export default assignmentSubmission;
