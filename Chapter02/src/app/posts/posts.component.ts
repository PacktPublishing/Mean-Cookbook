import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {Author} from "../author";

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  author = null;

  constructor(private router:Router) {
    this.author = new Author("Sam Wilder", 1);
  }

  visitAuthor() {
    this.router.navigateByUrl(`/authors/${this.author.id}`);
  }

  ngOnInit() {

  }

}
