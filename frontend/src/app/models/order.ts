export class Order{
  korIme:string = ""
  restoranId:string = ""
  vremeDostave:string = "" // moze biti 0 - nedefinisano, 23-20 do 30 min, 34-30 do 40 min i 56- 50 do 60 min
  status:string = "" // K-kreirana, O-dobijena, P-prihvacena
  naruceno: { naziv: string, kolicina: number }[] = []
  datum:Date = new Date()
  iznos:number = 0
}
