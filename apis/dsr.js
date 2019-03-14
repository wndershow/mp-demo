import http from '../utils/http';

export const getAudioScore = ({ fileLink, text }) => {
  return http
    .post(`/api/v2/audioScore`, {
      url: fileLink,
      text
    })
    .then(res => {
      let audioScore = res.data.audioScore || null;
      if (!audioScore) return audioScore;
      audioScore.audioQuality = audioScore.audioQuality.toLowerCase();
      audioScore.status = 'missing';
      let score = audioScore.score;
      if (score > 0 && score < 45) {
        audioScore.status = 'bad';
      } else if (score >= 45 && score < 85) {
        audioScore.status = 'soso';
      } else if (score >= 85) {
        audioScore.status = 'ok';
      }
      return audioScore;
    });
};
