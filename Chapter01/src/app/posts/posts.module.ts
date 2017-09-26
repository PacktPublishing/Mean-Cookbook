import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {PostsComponent} from "./posts.component";
import {PostComponent} from "./post/post.component";

const ROUTES = [{
  path: "posts",
  component: PostsComponent
}, {
  path: "posts/:id",
  component: PostComponent
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES)
  ],
  declarations: [
    PostsComponent,
    PostComponent
  ]
})
export class PostsModule { }
