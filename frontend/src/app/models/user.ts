export class User {
  constructor(
    public username: string = "",
    public password: string = "",
    public safeQuestion: string = "",
    public safeResponse: string = "",
    public name: string = "",
    public lastName: string = "",
    public gender: string = "",
    public adr: string = "",
    public phone: string = "",
    public email: string = "",
    public photo: string = "",
    public schoolType: string = ""
  ) {}
}
