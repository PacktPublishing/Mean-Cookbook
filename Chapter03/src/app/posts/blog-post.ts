import {User} from "../user";
export class BlogPost {
  constructor(
    public title: string = "",
    public content: string = "",
    public published: Date = new Date(),
    public author: User = new User("Nicholas", "McClay", "nmcclay@nickmcclay.com")
  ) {
  }
}
