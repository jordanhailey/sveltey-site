// import myWorker from "static/js/worker";
let worker;
describe("Worker can be initiated",()=>{
  worker = new Worker("../../../static/js/worker.js",{type:"module"})
  console.log({worker});
  expect(worker)
})