import LZMA from "./lzma_worker.js"
const {compress,decompress} = LZMA;

function fromArrayToBase64(buffer){
  let binaryOut = "";
  let byte_arr = new Uint8Array(buffer);
  const length = byte_arr.length;
  for (let i=0;i<length;i++){
    binaryOut += String.fromCharCode(byte_arr[i]);
  }
  let output = btoa(binaryOut);
  return {string:output,buffer};
}

function compressionFinished (res,err) {
  if (err) throw err;
  postMessage(fromArrayToBase64(res));
}

function processCompression(str="") {
  compress(str,9,compressionFinished);
}

function decompressionFinished (res,err) {
  if (err) throw err;
  postMessage({string:res},"/");
}

function processDecompression(base64="") {
  let binaryFromBase64Str = atob(base64);
  let length = binaryFromBase64Str.length;
  let buffer = new Int8Array(length);
  for (let i = 0; i < length; i++) {
    buffer[i] = binaryFromBase64Str.charCodeAt(i);
  }
  decompress(buffer,decompressionFinished);
}

addEventListener('message', e => {
  const {type,input} = e.data
  if(!type) postMessage("ERROR","/");
  switch (type) {
    case "compress":
      return processCompression(input);
    case "decompress":
      return processDecompression(input);
    default:
      return postMessage(input,"/");
  }
});

