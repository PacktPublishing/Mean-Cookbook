import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthorsComponent } from './authors/authors.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthorComponent } from './author/author.component';
import { PostsModule } from "./posts/posts.module";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { getLocaleProvider } from "./i18n-providers";
import { CurrentUserService } from "./current-user.service";
import { User } from "./user";

const ROUTES = [
  {
    path: "",
    redirectTo: "/posts",
    pathMatch: 'full'
  },
  {
    path: 'authors',
    component: AuthorsComponent,
  },
  {
    path: "**",
    component: PageNotFoundComponent
  }
];

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
    PostsModule,
    NgbModule.forRoot()
  ],
  providers: [{ provide: LOCALE_ID, useFactory: getLocaleProvider }, CurrentUserService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private currentUserService: CurrentUserService) {
    let user = new User('George', 'Washington', 'gwashington@history.gov');
    currentUserService.setUser(user);
    console.log(currentUserService.getUser().getName());
  }
}
