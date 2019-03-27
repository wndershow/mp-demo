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
