import env from "@/utils/env";

export class AuthStorage {
  private static access_token_key = env.VITE_AUTH_ACCESS_TOKEN_KEY;
  private static storage: Storage = localStorage;

  static removeAccessToken() {
    this.storage.removeItem(this.access_token_key);
  }

  static setAccessToken(val: string) {
    this.storage.setItem(this.access_token_key, val);
  }

  static getAccessToken(): string | null {
    return this.storage.getItem(this.access_token_key);
  }
}
