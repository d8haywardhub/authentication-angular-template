export interface User {
    id?: number;
    email: string;
    password: string;
    jwt?: string;
    serverKey?: string;
    name: string;
    role?: string;
    disabled?: Boolean;
    resetRequired?: Boolean;
}
