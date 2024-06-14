export class Restaurant{
  _id: string = "";
  Naziv: string = ""
  Adresa: string = ""
  Tip: string = ""
  Konobari:string[] = []
  ProsecnaOcena: number = 0
  Telefon:string = ""
  Opis:string = ""
  RadniDani: {
    [key: string]: { od: string; do: string, radan: boolean };
  } = {
    "1": { od: "", do: "" , radan: false},
    "2": { od: "", do: "" , radan: false},
    "3": { od: "", do: "", radan: false },
    "4": { od: "", do: "", radan: false },
    "5": { od: "", do: "" , radan: false},
    "6": { od: "", do: "" , radan: false},
    "7": { od: "", do: "" , radan: false}
  }
}
