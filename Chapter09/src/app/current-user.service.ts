import { Injectable } from '@angular/core';
import {User} from "./user";
import {Http, Headers, Response, RequestOptions} from '@angular/http';
import {Observable, BehaviorSubject} from "rxjs";
import 'rxjs/add/operator/toPromise';
import {JwtHelper} from "angular2-jwt";
import {getToken, deleteToken} from "./jwt/jwt.module";

@Injectable()
export class CurrentUserService {
  private user = new BehaviorSubject<User>(new User());
  private jwtHelper: JwtHelper = new JwtHelper();

  constructor(private http: Http) {
    let token = getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.setUser(this.decodeUserFromToken(token));
    }
  }

  getUser(): Observable<User> {
    return this.user.asObservable();
  }

  decodeUserFromToken(token): User {
    let userJSON = this.jwtHelper.decodeToken(token);
    return new User(userJSON.firstName, userJSON.lastName, userJSON.email);
  }

  setUser(newUser:User) {
    this.user.next(newUser);
  }

  login(username: string, password: string): Promise<User> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post('/api/login', JSON.stringify({ username: username, password: password }), options)
      .toPromise()
      .then((response) => {
        let token = response.json();
        let user = this.decodeUserFromToken(token);
        this.setUser(user);
        return user;
      }).catch((error) => {
        let errorJSON = JSON.parse(error._body).errors[0];
        return Promise.reject(errorJSON);
      })
  }

  logout(): void {
    this.setUser(new User());
    deleteToken();
  }
}
