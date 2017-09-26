export class Author {

  constructor(public name:String, public id:Number) {}

  homepage() {
    return "/authors/" + this.id;
  }
}
