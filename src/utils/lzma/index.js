import {compress, decompress} from "lzma-native";
import base64url from "base64url"

export const decompression = (input = "") => {
	return new Promise(async (resolve,reject) => {
		try {
			if (typeof input !== "string") throw new Error("Unable to decompress, not a string.");
			const buffer = Buffer.from(base64url.toBase64(input),'base64')
			await decompress(buffer, 9, (decoded = Buffer.from("","base64url")) => {
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
			await compress(`${input}`, 9, (buffer = Buffer.from("","utf8")) => {
				resolve(base64url(buffer).toString());
			});
		} catch (error) {
			reject(error);
		} 	
	});
}
