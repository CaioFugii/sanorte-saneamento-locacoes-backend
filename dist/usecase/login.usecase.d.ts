export declare class LoginUseCase {
    execute(payload: {
        user: string;
        password: string;
    }): {
        token: string;
    };
}
