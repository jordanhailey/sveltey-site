import {compress, decompress} from "lzma-native";
const lzma = require("lzma");
import base64url from "base64url"

export const decompression = (input = "") => {
	return new Promise(async (resolve,reject) => {
		try {
			if (typeof input !== "string") throw new Error("Unable to decompress, not a string.");
			const buffer = Buffer.from(base64url.toBase64(input),'base64')
			decompress(buffer, 9, (decoded = Buffer.from("","base64")) => {
				resolve(decoded.toString());
			});
		} catch (error) {
			reject(error);
		}	
	})
};

export const compression = (input="") => {
	return new Promise(async (resolve,reject) => {
		try {
			if (input === "") throw new Error("Unable to compress empty string");
			else if (typeof input !== "string" && typeof input !== "number") {
				throw new Error("Input can not be coerced");
			} 
			compress(`${input}`, 9, (buffer = Buffer.from("","utf8")) => {
				resolve(base64url(buffer).toString());
			});
		} catch (error) {
			reject(error);
		} 	
	});
}

export const lzmajsC = (input="") => {
	return new Promise(async (resolve,reject) => {
		let lzmaJS = lzma;
		try {
			let byteArr = lzmaJS.compress(input,9);
			let string = base64url(byteArr).toString();
			resolve(string);
		} catch (error) {
			console.log(error)
			reject(error);
		}
	})
}

export const lzmajsD = (input="") => {
	return new Promise(async (resolve,reject) => {
		let lzmaJS = lzma;
		try {
			let unBase64d = base64url.toBase64(input).toString();
			let byteArr = Buffer.from(unBase64d,"base64");
			let decoded = lzmaJS.decompress(byteArr);
			resolve(decoded);
		} catch (error) {
			console.log(error)
			reject(error)
		}
	})
}

