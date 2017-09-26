export class User {
  constructor(
    public firstName: string = "",
    public lastName: string = "",
    public email: string = ""
  ) {}

  getName() {
    return this.firstName + ' ' + this.lastName;
  }

  isAuthenticated() {
    return this.email !== "";
  }
}
