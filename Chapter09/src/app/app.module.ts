import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';
import { AppComponent } from './app.component';
import { AuthorsComponent } from './authors/authors.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthorComponent } from './author/author.component';
import { PostsModule } from "./posts/posts.module";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { getLocaleProvider } from "./i18n-providers";
import { CurrentUserService } from "./current-user.service";
import { LoginComponent } from './login/login.component';
import { JwtModule } from './jwt/jwt.module';
import { PaymentComponent } from './payment/payment.component';
import '../font-awesome.font';

const ROUTES = [
  {
    path: "",
    redirectTo: "/posts",
    pathMatch: 'full'
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "payment",
    component: PaymentComponent,
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
    AuthorComponent,
    LoginComponent,
    PaymentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES),
    PostsModule,
    NgbModule.forRoot(),
    Angular2FontawesomeModule,
    JwtModule
  ],
  providers: [{ provide: LOCALE_ID, useFactory: getLocaleProvider }, CurrentUserService],
  bootstrap: [AppComponent]
})
export class AppModule {}
