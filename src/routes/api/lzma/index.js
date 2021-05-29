import {compression} from "$utils/lzma"

export async function post(req,res) {
  return new Promise(async(resolve,reject) => {
    try {
      let compressed = await compression(req?.body);
      resolve({body:compressed})
    } catch (error) {
      reject({
        status: 400,
        body: error
      })
    }
  })
}