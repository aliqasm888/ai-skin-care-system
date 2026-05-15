export interface SignupDTO {
  name: string;
  email: string;
  password: string;
  age?: number;
  gender?: "male" | "female";
}

export interface LoginDTO {
  email: string;
  password: string;
}