export class User {
  userId: number;
  username: string;
  // TODO: example only; do NOT store passwords in plain text in production, use bcrypt (one way hash with salt)
  password: string;
}
