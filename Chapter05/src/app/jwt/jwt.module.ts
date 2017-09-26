import { NgModule } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

const tokenName = 'jwt-express';
export function getToken():string {
  let ca: Array<string> = document.cookie.split(';');
  let caLen: number = ca.length;
  let cookieName = `${tokenName}=`;
  let c: string;
  for (let i: number = 0; i < caLen; i += 1) {
    c = ca[i].replace(/^\s+/g, '');
    if (c.indexOf(cookieName) == 0) {
      return c.substring(cookieName.length, c.length);
    }
  }
  return '';
}

export function deleteToken() {
  document.cookie = `${tokenName}=; expires=-1`;
}

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    tokenGetter: (() => getToken()),
  }), http, options);
}

@NgModule({
  providers: [
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ]
})
export class JwtModule {}
