export interface User {
  uid?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string[];
  role?: 'user' | 'admin';
}

// export interface User {
//   id?: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   phoneNumber: string[];
// }
