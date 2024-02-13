export class User {
  constructor(
    public ime: string = "",
    public prezime: string = "",
    public korIme: string = "",
    public lozinka: string = "",
    public pol: string = "",
    public adresa: string = "",
    public telefon: string = "",
    public mejl: string = "",
    public tip: string = "",
    public aktivan:boolean = false,
    public tipSkole: string = "",
    public trenutniRazred: number = 0,
    public bezPitanje: {pitanje:string, odgovor:string},
    public slika: string = "",
    public nastavnikPitanja: {zeljeniPredmeti:string[], zeljeniRazredi:string[], izvor:string},
    public cv: string = ""
  ) {}
}
