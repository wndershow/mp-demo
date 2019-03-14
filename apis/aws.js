import http from '../utils/http';
import * as helper from '../utils/helper';
import regeneratorRuntime from '../vendor/runtime';

const pre_sign_url = '/api/v1/files/s3/preSignedUrl';
const fileManager = wx.getFileSystemManager();

export const s3Upload = async ({ type, path, size, meta }) => {
  if (!validateType(type)) {
    console.error(`unsupported resource type: ${type}`);
    return;
  }
  let resourceType = type.toUpperCase();
  let fileName = helper.genNo() + new Date().getTime();
  let signData = await s3PreSign({ fileName, resourceType });
  let uploadUrl = signData.preSignUrl;
  let downloadUrl = signData.downloadUrl;

  let readRes = await readFile(path);
  await http.put(uploadUrl, readRes.data, { 'content-type': toHttpContentType(resourceType), 'cache-control': 'max-age: 21600' }, true);
  return downloadUrl;
};

export const s3PreSign = async ({ fileName, resourceType }) => {
  let url = `${pre_sign_url}?fileName=${fileName}&resourceType=${resourceType}&appType=MOJIAO`;
  let signRes = await http.get(url);
  console.info(signRes);
  return signRes.data;
};

function readFile(path) {
  return new Promise((resovle, reject) => {
    fileManager.readFile({
      filePath: path,
      success(res) {
        resovle(res);
      },
      fail(err) {
        reject(err);
      }
    });
  });
}

function validateType(type) {
  if (!type) {
    return false;
  }
  let supportedTypes = ['IMAGE', 'VIDEO', 'AUDIO'];
  return supportedTypes.includes(type.toUpperCase());
}

function toHttpContentType(type) {
  switch (type) {
    case 'IMAGE':
      return 'image/*';
    case 'AUDIO':
      return 'audio/mp3';
    case 'VIDEO':
      return 'video/*';
  }
}
