import { Component, OnInit } from '@angular/core';
import {BlogPostsService} from "../blog-posts.service";
import {BlogPost} from "../blog-post";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {
  posts: BlogPost[];
  private loadingPosts: boolean = false;
  private metadata: Object;
  private postLoadError: Object;

  constructor(private blogPostsService: BlogPostsService) { }

  ngOnInit() {
    let promises:Promise<any>[] = [];
    promises.push(this.blogPostsService.getPosts());
    promises.push(this.blogPostsService.getBlogMetadata());
    Promise.all(promises).then(
      (data) => {
        this.posts = data[0];
        this.metadata = data[1]
      }
    ).catch(error => { this.postLoadError = error });
  }

  loadMorePosts() {
    if (!this.loadingPosts) {
      this.loadingPosts = true;
      this.blogPostsService.getNextPage().then(posts => {
        this.posts = this.posts.concat(posts);
        this.loadingPosts = false;
      }).catch(error => { this.postLoadError = error });
    }
  }
}
