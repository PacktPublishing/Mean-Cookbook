import {BlogPost} from "./blog-post";

export class PostPage {
  constructor(
    public kind: string,
    public nextPageToken: string,
    public items: BlogPost[],
    public etag: string
  ) {}
}
