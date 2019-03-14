import regeneratorRuntime from '../vendor/runtime';
import http from '../utils/http';

export const createMaterial = async ({ type, key, size, meta = {} }) => {
  let res = await http.post(`https://beta-ark.modteach.cn/graphql`,
    {
      query: `
        mutation($meta: JSON) {
          createMaterial(material: {
            type: "${type}",
            key: "${key}",
            size: ${size},
            meta: $meta
          }) {
            id
            type
            size
            key
            meta
          }
        }
      `,
      variables: {
        meta
      }
    }
  );
  return res.data.data.createMaterial
}
