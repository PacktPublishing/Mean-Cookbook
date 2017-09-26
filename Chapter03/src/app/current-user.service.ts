import { Injectable } from '@angular/core';
import {User} from "./user";

@Injectable()
export class CurrentUserService {

  user: User;

  getUser() {
    return this.user;
  }

  setUser(newUser:User) {
    return this.user = newUser;
  }
}
