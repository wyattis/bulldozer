import passwords from "../passwords";

export default class PasswordService {
  async getLevel (password: string): Promise<number> {
    return passwords[password] !== undefined ? passwords[password] : -1
  }
}