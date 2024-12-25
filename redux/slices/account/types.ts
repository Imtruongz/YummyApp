export interface account {
  displayName?: string;
  photoURL?: string;
}
export interface accountState {
  account: account;
  isLogged: boolean;
}
