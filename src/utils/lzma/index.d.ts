type Modes = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * @param str A string or an array of bytes to compress
 * @param [mode] Compression mode, 1 being fastest but lightest compression, 9 being slowest but highest compression. Defaults to `6`.
 * @param [on_finish] A callback function which handles the *result* and *error* message which may come from the compression function. (**Note**: A callback number is supplied in the case of using a service worker.). When using `compress()` synchronously (not recommended), this callback is not used.
 * @param [on_progress] A callback function which handles *percent* (progress percentage as calculated by the service worker). When using `compress()` synchronously (not recommended), this callback is not used.
 * @result Will be returned as a Uint8Array
 */
export function compress(
    str: string | ArrayBuffer,
		mode?: Modes = 6,
    on_finish?: onFinishFn|number,
		on_progress?: onProgressFn,
): void;

/**
 * @param byte_array A buffer to decompress
 * @param [on_finish] A callback function which handles the *result* and *error* message which may come from the compression function. (**Note**: A callback number is supplied in the case of using a service worker.). When using `compress()` synchronously (not recommended), this callback is not used.
 * @param [on_progress] A callback function which handles *percent* (progress percentage as calculated by the service worker). When using `compress()` synchronously (not recommended), this callback is not used.
 * @result Will be returned as a string if it decodes as valid UTF-8 text; otherwise, it will return a Uint8Array instance.
 */
export function decompress(
    byte_array: ArrayBuffer,
    on_finish?: onFinishFn|number,
		on_progress?: onProgressFn,
): string | Uint8Array;


export function onProgressFn(percent:number): void;
export function onFinishFn(result: Buffer, error: Error): void;
