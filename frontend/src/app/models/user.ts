export class User {
  _id:string;
  ime: string;
  prezime: string;
  korIme: string;
  lozinka: string;
  pol: string;
  adresa: string;
  telefon: string;
  mejl: string;
  tip: string;
  aktivan: boolean;
  prihvacen: boolean;
  blokiran:boolean
  bezPitanje: { pitanje: string; odgovor: string };
  slika: string;
  brojKreditneKartice: string;
  strajk:number;

  constructor(
    _id:string = "",
    ime: string = "",
    prezime: string = "",
    korIme: string = "",
    lozinka: string = "",
    pol: string = "",
    adresa: string = "",
    telefon: string = "",
    mejl: string = "",
    tip: string = "",
    aktivan: boolean = false,
    prihvacen: boolean = false,
    blokiran:boolean = false,
    bezPitanje: { pitanje: string; odgovor: string } = { pitanje: "", odgovor: "" },
    slika: string = "",
    brojKreditneKartice: string = ""
  ) {
    this.ime = ime;
    this.prezime = prezime;
    this.korIme = korIme;
    this.lozinka = lozinka;
    this.pol = pol;
    this.adresa = adresa;
    this.telefon = telefon;
    this.mejl = mejl;
    this.tip = tip;
    this.aktivan = aktivan;
    this.prihvacen = prihvacen;
    this.blokiran = blokiran;
    this.bezPitanje = bezPitanje;
    this.slika = slika;
    this.brojKreditneKartice = brojKreditneKartice;
    this._id = ""
    this.strajk = 0
  }
}
