export class User {
  constructor(
    public ime: string = "",
    public prezime: string = "",
    public korIme: string = "",
    public lozinka: string = "",
    public pol: string = "",
    public adresa: string = "",
    public brojTelefona: string = "",
    public mejl: string = "",
    public tip: string = "",
    public aktivan:boolean = false,
    public bezPitanje: {pitanje:string, odgovor:string},
    public slika: string = "",
    public brojKredineKartice = ""
  ) {}
}
