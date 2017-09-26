import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { PostsComponent } from "./posts.component";
import { PostComponent } from "./post/post.component";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome'


const ROUTES = [{
  path: "posts",
  component: PostsComponent,
  children: [
    {
      path: ":id",
      component: PostComponent
    }
  ]
}];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ROUTES),
    NgbModule,
    Angular2FontawesomeModule
  ],
  declarations: [
    PostsComponent,
    PostComponent
  ]
})
export class PostsModule { }
