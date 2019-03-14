import http from '../utils/http';

export const sendFormIds = ids => {
  if (typeof ids == 'string') ids = [ids];
  if (!ids.length) return;
  let notificationMetadatas = [];
  ids.forEach(n => {
    notificationMetadatas.push({
      formId: n
    });
  });
  return http.post(`/api/v1/notifications/metadatas`, {
    notificationMetadatas
  });
};
