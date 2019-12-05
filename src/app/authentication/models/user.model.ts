export interface User {
    id?: number;
    email: string;
    password: string;
    jwt: string
    name: string;
    role?: string;
    disabled?: Boolean;
    resetRequired?: Boolean;
}
