import { Component, OnInit } from '@angular/core';
import {CurrentUserService} from "../current-user.service";
import {User} from "../user";

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.css']
})
export class AuthorsComponent implements OnInit {

  user: User;
  constructor(private currentUserService: CurrentUserService) { }

  ngOnInit() {
    this.user = this.currentUserService.getUser();
  }

}
