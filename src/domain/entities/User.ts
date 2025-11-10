/**
 * Domain Entity: User
 * Entidad de usuario en el frontend
 */
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  lastSignInAt?: Date;
}
