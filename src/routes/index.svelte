<script>
  import {onMount} from "svelte";
  import {isEditing} from "../stores";
  
  $: worker = undefined;
  $: workerPromise = undefined;
  $: workerCallTimeout = undefined;
  $: input = "";
  $: encoded = "";
  $: encodedBuffer = [];
  $: decoded = "";
  $: hash = "";
  
  // Trigger updates on reactive variable change
  $: {if (encoded) {
      hash = `#/?${encoded}`;
      window.location.hash = hash;
      // console.log({encoded,encodedBuffer});
    }
  }
  
  $: {if (!input && $isEditing && hash) clearHash ();}
  
  $: {if (decoded) {
      input = decoded;
      decoded = "";
    }
  }

  // On initial load, mount web worker and check for location hash to decode
  onMount(async function onFirstMount(){
    worker = new Worker("/js/worker.js",{type:"module"});
    if (!$isEditing) {
      let winHash = window.location.hash;
      if (winHash.length > 3) {
        // console.log(`decoding ${winHash.substr(3)}`);
        decodeHash(winHash.substr(3));
      }
    }
  });
  
  // Functions
  function clearHash(){
    window.location.hash = "";
  }

  function decodeHash(encodedStr) {
    queueWorker({input:encodedStr,type:"decompress"});
  }

  function handleKeyUpEvent(event) {
    isEditing.set(true);
    const {key} = event;
    // console.log(key);
    if (/Arrow|Meta|Control|Shift|Page|Alt|Home|End/.test(key)) return;
    queueWorker({input:input,type:"compress"});
  }
  
  function handleBlurEvent(event) {
    isEditing.set(false);
  }

  function queueWorker(msg) {
    if (worker) debounceWorkerCall(msg);
  }

  function debounceWorkerCall(msg={input:"",type:"compress"}) {
    if (workerCallTimeout) clearTimeout(workerCallTimeout);
    function sendCallToWorker() {
      workerPromise = establishAsyncWorkerChannel(msg);  
      workerPromise.then(
        function updateValuesFromReturn({string,buffer}) {
          msg.type === "compress" ? 
          (function setCompressionReturn() {encoded=string;encodedBuffer=buffer})() : 
          decoded=string
        });
      workerPromise.catch(function handleWorkerError(error) {console.log(error);});
    }
    workerCallTimeout = setTimeout(sendCallToWorker,500);
  }
  
  function establishAsyncWorkerChannel(input) {
    if (!worker) return Promise.reject();
    return new Promise(
      function communicateWithWorker(resolve,reject) {
        worker.onerror = reject;
        worker.onmessage = function retrieveMessageFromWorker(event) {
          resolve(event.data);
        };
        worker.postMessage(input);
      });
  }
</script>

<!-- TODO: Make title editable and encode in hash -->
<h1>Untitled</h1>
<textarea bind:value={input} 
  on:keyup={handleKeyUpEvent} 
  on:blur={handleBlurEvent}
/>
<!-- 
  TODO: 
  - Turn the "editor" (textarea) into its own component(s)
  - create js-disabled workflow, wrapping textarea in a form and 
    using svelte actions to handle the POST request
 -->

<style>
  /* TODO: migrate default styling to static css file, handle only 
    block level styling and exceptions in svelte files 
  */
  textarea {
    width: 100%;
    min-height: 80vh;
  }
</style>
