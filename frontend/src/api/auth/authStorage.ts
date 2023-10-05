export class AuthStorage {
  private static access_token_key = "__access_token__";
  private static refresh_token_key = "__refresh_token__";
  private static user_role_key = "__user_role_key__";
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

  static getUserRole(): string | null {
    return this.storage.getItem(this.user_role_key);
  }

  static removeRefreshToken() {
    this.storage.removeItem(this.refresh_token_key);
  }

  static setRefreshToken(val: string) {
    this.storage.setItem(this.refresh_token_key, val);
  }

  static getRefreshToken(): string | null {
    return this.storage.getItem(this.refresh_token_key);
  }
}

export type UserRole = "Client" | "Seller" | "";
