import {makeAutoObservable} from 'mobx';

export class AppState {
  skipOnboarding: boolean = false;
  constructor() {
    makeAutoObservable(this);
  }
  onChangeAppState = () => {
    this.skipOnboarding = true;
  };
}
