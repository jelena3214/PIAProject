export class Restaurant{
  _id: string = "";
  Naziv: string = ""
  Adresa: string = ""
  Tip: string = ""
  Konobari:number[] = []
  ProsecnaOcena: number = 0
  Telefon:string = ""
  RadniDani: {
    [key: string]: { od: string; do: string };
  } = {
    "1": { od: "", do: "" },
    "2": { od: "", do: "" },
    "3": { od: "", do: "" },
    "4": { od: "", do: "" },
    "5": { od: "", do: "" },
    "6": { od: "", do: "" },
    "7": { od: "", do: "" }
  }
  Stolovi: {
    stoID: number,
    maksimalanBrojLjudi: number
  }[] = [];
}
