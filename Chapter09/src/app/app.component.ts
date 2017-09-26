import { Component } from '@angular/core';
import {CurrentUserService} from "./current-user.service";
import {User} from "./user";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public authorCount: Number = 3;
  public currentUser$: Observable<User>;

  constructor(private currentUserService: CurrentUserService) {
    this.currentUser$ = currentUserService.getUser();
  }

  logout(): void {
    this.currentUserService.logout();
  }
}
