import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {CurrentUserService} from "../current-user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  model:any = {};
  loading:boolean = false;
  error:string = '';

  constructor(private router: Router,
              private currentUser: CurrentUserService) {
  }

  ngOnInit() {
    this.currentUser.logout();
  }

  login() {
    this.loading = true;
    this.currentUser.login(this.model.username, this.model.password)
      .then((user) => {
        this.router.navigate(['/']);
      }).catch((error) => {
        this.error = error.detail;
        this.loading = false;
      });
  }
}
