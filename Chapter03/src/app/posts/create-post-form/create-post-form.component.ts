import {Component, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BlogPost} from "../blog-post";
import {CurrentUserService} from "../../current-user.service";
import {User} from "../../user";

@Component({
  selector: 'app-create-post-form',
  templateUrl: './create-post-form.component.html',
  styleUrls: ['./create-post-form.component.scss'],
})
export class CreatePostFormComponent implements OnInit {
  model: BlogPost;
  user: User;
  constructor(private modalService: NgbModal, private currentUserService: CurrentUserService) {}

  open(content) {
    this.model = new BlogPost("New Post Title");
    this.modalService.open(content, {backdrop: "static", size: "lg"});
  }

  submit() {
    console.log(JSON.stringify(this.model));
  }

  ngOnInit() {
    this.user = this.currentUserService.getUser();
  }
}
