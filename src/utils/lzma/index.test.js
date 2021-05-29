import { compression, decompression } from "./index";

const string = "Banana", emptyString = "", number = 12, object = {"Hello":"World"};

const html =
`
<div class="test-html">
	<h1>Hello, World!</h1>
	<p>This is a test

	to see if formatting comes back through decompression...
	</p>
</div>
`;

const md = 
`
# Hello World!
	- This is a test...
		- to see if formatting comes back through decompression...
`;

describe("Compression", () => {
	test("returns an encoded string", async () => {  
		await compression(string)
			.then(output=>expect(typeof output === "string").toBe(true))
	});

	// test("buffer values are consistent", async () => {
	// 	let compression1 = await compression(html);
	// 	let compression2 = await compression(html);
	// 	let compression3 = await compression(html+"\n<div></div>");
	// 	let allMatch = Object.entries(compression2).every(([i,v])=>{
	// 			let comparison = compression1[i];
	// 			return v === comparison;
	// 	});
	// 	let shouldntMatch = Object.entries(compression3).every(([i,v])=>{
	// 			let comparison = compression1[i];
	// 			return v === comparison;
	// 	});
	// 	expect(allMatch).toBe(true);
	// 	expect(shouldntMatch).toBe(false);
	// })

	test("accepts both strings and numbers as input", async () => {
		await expect(compression(string)).resolves;
		await expect(compression(number)).resolves;
	})

	test("rejects empty strings", async () => {  
		await expect(compression(emptyString)).rejects.toThrow(/empty string/i)
	});

	test("rejects values that are not strings or numbers", async () => {  
		await expect(compression(object)).rejects.toThrow(/coerced/i)
	});
});

describe("Decompression", () => {
	test("is able to decode a base64url string", () => {
		return compression(string)
			.then(compressed => expect(decompression(compressed)).resolves)
	});

	test("rejects a non-string input", () => {
		return decompression(object)
			.then(result=>{throw new Error("result should not have been returned: " + result)})
			.catch(err=>expect(err.toString()).toMatch(/not a string/i));
	});

	test("returns a string", () => {
		return compression(string)
			.then(compressed => decompression(compressed))
			.then(output => expect(typeof output).toBe("string"))
	});
});

describe("Compression -> Decompression", () => {
	test("html formatting is preserved through compression", () => {
		return compression(html)
			.then(compressed => decompression(compressed))
			.then(decompressed => expect(decompressed).toBe(html))
	})
	test("md formatting is preserved through compression", () => {
		return compression(md)
			.then(compressed => decompression(compressed))
			.then(decompressed => expect(decompressed).toBe(md))
	})
})



let fullDoc=`import { compression, decompression } from "./index";

const string = "Banana", emptyString = "", number = 12, object = {"Hello":"World"};

const html =
\`
<div class="test-html">
	<h1>Hello, World!</h1>
	<p>This is a test

	to see if formatting comes back through decompression...
	</p>
</div>
\`;

const md = 
\`
# Hello World!
	- This is a test...
		- to see if formatting comes back through decompression...
\`;

describe("Compression", () => {
	test("returns an encoded string", async () => {  
		await compression(string)
			.then(output=>expect(typeof output === "string").toBe(true))
	});

	// test("buffer values are consistent", async () => {
	// 	let compression1 = await compression(html);
	// 	let compression2 = await compression(html);
	// 	let compression3 = await compression(html+"\n<div></div>");
	// 	let allMatch = Object.entries(compression2).every(([i,v])=>{
	// 			let comparison = compression1[i];
	// 			return v === comparison;
	// 	});
	// 	let shouldntMatch = Object.entries(compression3).every(([i,v])=>{
	// 			let comparison = compression1[i];
	// 			return v === comparison;
	// 	});
	// 	expect(allMatch).toBe(true);
	// 	expect(shouldntMatch).toBe(false);
	// })

	test("accepts both strings and numbers as input", async () => {
		await expect(compression(string)).resolves;
		await expect(compression(number)).resolves;
	})

	test("rejects empty strings", async () => {  
		await expect(compression(emptyString)).rejects.toThrow(/empty string/i)
	});

	test("rejects values that are not strings or numbers", async () => {  
		await expect(compression(object)).rejects.toThrow(/coerced/i)
	});
});

describe("Decompression", () => {
	test("is able to decode a base64url string", () => {
		return compression(string)
			.then(compressed => expect(decompression(compressed)).resolves)
	});

	test("rejects a non-string input", () => {
		return decompression(object)
			.then(result=>{throw new Error("result should not have been returned: " + result)})
			.catch(err=>expect(err.toString()).toMatch(/not a string/i));
	});

	test("returns a string", () => {
		return compression(string)
			.then(compressed => decompression(compressed))
			.then(output => expect(typeof output).toBe("string"))
	});
});

describe("Compression -> Decompression", () => {
	test("html formatting is preserved through compression", () => {
		return compression(html)
			.then(compressed => decompression(compressed))
			.then(decompressed => expect(decompressed).toBe(html))
	})
	test("md formatting is preserved through compression", () => {
		return compression(md)
			.then(compressed => decompression(compressed))
			.then(decompressed => expect(decompressed).toBe(md))
	})
}`
test("test fragment length", ()=>{
	let fragment = "";
	console.log(fragment.length,fullDoc.length);

})

