export type Role = "STUDENT" | "COMPANY";

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
}
