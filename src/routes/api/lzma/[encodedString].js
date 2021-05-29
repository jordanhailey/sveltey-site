import {decompression} from '$utils/lzma';

export async function get(req,res) {
  return new Promise(async (resolve,reject) => {
    try {
      let decompressed = await decompression(req?.params?.encodedString);
      resolve({body:decompressed})
    } catch (error) {
      reject({
        status: 400,
        body: error
      })
    }
  });
}