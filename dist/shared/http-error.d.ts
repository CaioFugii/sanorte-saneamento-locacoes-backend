export declare class HttpError extends Error {
    message: string;
    code: number;
    constructor(message: string, code: number);
}
