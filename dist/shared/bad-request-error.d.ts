import { HttpError } from "./http-error";
type Errors = {
    property: string;
    message: string;
};
export declare class BadRequestError extends HttpError {
    errors: Errors[];
    constructor(errors: Errors[]);
}
export {};
