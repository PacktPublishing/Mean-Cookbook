import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule, PreloadAllModules} from '@angular/router';
import { AppComponent } from './app.component';
import { AuthorsComponent } from './authors/authors.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthorComponent } from './author/author.component';
import {PostsModule} from "./posts/posts.module";

const ROUTES = [{
  path: 'authors',
  component: AuthorsComponent,
}];

@NgModule({
  declarations: [
    AppComponent,
    AuthorsComponent,
    PageNotFoundComponent,
    AuthorComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES),
    PostsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
