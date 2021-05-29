<script>
	import { onMount, tick } from "svelte";
	$: string = "Banana"
	$: decompressed = "";
	$: compressed = "";
	$: response = "";

	$: {
		if (string) handleInputChange(string)
	}
	$: {
		if (compressed) fetchDecompressed()
	}

	onMount(()=>{
		fetch("/api/lzma",{method:"POST",body:string})
			.then(res=>res.text())
			.then(fragment=>compressed = fragment)
	})

	let compressionTimeout;
	
	function handleInputChange(string){
		console.log(string)
		if (compressionTimeout) clearTimeout(compressionTimeout);
		debounceFetch();
	}
	
	function debounceFetch(){
		tick();
		compressionTimeout = setTimeout(()=>{
			console.log("fetching", string)
			fetchEndpoint()
		},2000)
	}
	
	let decompressionTimeout;
	async function fetchDecompressed() {
		decompressed = await fetch(`/api/lzma/${compressed}`).then(res=>res.text())
	}
	
	async function fetchEndpoint(){
		compressed = await fetch("/api/lzma",{method:"POST",body:string})
			.then(res=>res.text())
			.then(fragment=>compressed = fragment)
	}
</script>

<textarea bind:value={string}/>
<div>
	{#if compressed}
		<pre>{JSON.stringify(compressed)}</pre>
		{#if decompressed}
			<pre>{decompressed}</pre>
		{/if}
	{/if}
</div>