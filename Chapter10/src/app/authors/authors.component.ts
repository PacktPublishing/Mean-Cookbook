import { Component, OnInit } from '@angular/core';
import {CurrentUserService} from "../current-user.service";
import {User} from "../user";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.css']
})
export class AuthorsComponent implements OnInit {
  currentUser: Observable<User>;
  constructor(private currentUserService: CurrentUserService) { }

  ngOnInit() {
    this.currentUser = this.currentUserService.getUser();
  }
}
