import { Injectable } from '@angular/core';
import {BlogPost} from "./blog-post";
import {PostPage} from "./post-page";
import {Http, URLSearchParams} from "@angular/http";
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class BlogPostsService {
  private apiHostUrl = 'https://www.googleapis.com';
  private blogUrl = this.apiHostUrl + '/blogger/v3/blogs/7159470537406093899';
  private postsUrl = this.blogUrl + '/posts';
  private nextPageToken: string;
  private pageCache: { [token: string]: PostPage } = {};

  constructor(private http: Http) {}

  getNextPage(): Promise<BlogPost[]> {
    return this.getPosts(this.nextPageToken);
  }

  private writePageToCache(token: string, page: PostPage) {
    this.pageCache[token] = page as PostPage;
    console.log(this.pageCache);
  }

  private readPageFromCache(token: string): PostPage {
    if (this.pageCache[token]) {
      return this.pageCache[token];
    }
  }

  private requestPosts(params: URLSearchParams = new URLSearchParams()): Promise<any> {
    params.set('key', environment.bloggerAPIKey);
    return this.http.get(this.postsUrl, {params: params})
      .toPromise()
      .then((response) => {
        return response.json();
      })
  }

  getPosts(pageToken: string = 'first_page'): Promise<BlogPost[]> {
    let cachedPage = this.readPageFromCache(pageToken);
    if (cachedPage) {
      this.nextPageToken = cachedPage.nextPageToken;
      return Promise.resolve(cachedPage.items);
    } else {
      let params: URLSearchParams = new URLSearchParams();
      if (pageToken !== 'first_page') params.set('pageToken', pageToken);
      return this.requestPosts(params).then((JSON) => {
        let posts = JSON.items;
        this.nextPageToken = JSON.nextPageToken;
        this.writePageToCache(pageToken, JSON);
        return posts as BlogPost[]
      }).catch(this.handleError);
    }
  }

  getBlogMetadata(): Promise<number> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('key', environment.bloggerAPIKey);
    return this.http.get(this.blogUrl, {params: params})
      .toPromise()
      .then((response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    let errorJSON = JSON.parse(error._body).error;
    console.error('An error occurred', errorJSON);
    return Promise.reject(errorJSON || error);
  }
}
