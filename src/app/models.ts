interface Deserializable {
  deserialize(input: any): this;
  fromJson(json: any): this;
}

export class Diaria implements Deserializable {
  id: number;
  almoco: Ementa;
  jantar: Ementa;
  observacoes: string[];
  data: Date;
  static idCounter = 0;

  fmtData(): String {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString
    const options = { weekday: 'short', month: 'long', day: 'numeric' };
    return this.data.toLocaleDateString('pt-PT', options);
  }

  fmtDataShort(): String {
    const options = { month: 'long', day: 'numeric' };
    return this.data.toLocaleDateString('pt-PT', options);
  }

  isSameDay(date: Date) {
    return (
      date.getFullYear() === this.data.getFullYear() &&
      date.getMonth() === this.data.getMonth() &&
      date.getDate() === this.data.getDate()
    );
  }

  isToday() {
    const today = new Date();
    return this.isSameDay(today);
  }

  deserialize(json: any) {
    this.data = new Date(json.Data);
    this.observacoes = json.Observacoes;
    this.almoco = new Ementa().deserialize(json.TiposRefeicao[0]);
    this.jantar = new Ementa().deserialize(json.TiposRefeicao[1]);
    this.id = Diaria.idCounter++;
    return this;
  }

  fromJson(json: any) {
    this.data = new Date(json.data);
    this.observacoes = json.observacoes;
    this.almoco = new Ementa().fromJson(json.almoco);
    this.jantar = new Ementa().fromJson(json.jantar);
    this.id = Diaria.idCounter++;
    return this;
  }
}

export class Ementa implements Deserializable {
  pratos: Prato[];
  info: string;
  tipo: string; // almoço, jantar

  deserialize(json: any) {
    this.info = json.InfoAdicional;
    this.tipo = json.Descricao == 'Jantar' ? 'jantar' : 'almoco';
    this.pratos = [];
    for (let i in json.TiposPrato) {
      this.pratos.push(new Prato().deserialize(json.TiposPrato[i]));
    }
    return this;
  }

  fromJson(json: any) {
    this.info = json.info;
    this.tipo = json.tipo;
    this.pratos = [];
    for (let i in json.pratos) {
      this.pratos.push(new Prato().fromJson(json.pratos[i]));
    }
    return this;
  }
}

export class Prato implements Deserializable {
  nome: string;
  tipo: string; // sopa, peixe, carne, dieta, vegetariano
  calorias: number;
  alergenos: string[];

  deserialize(json: any) {
    this.nome = json.Nome;
    this.tipo = json.Descricao.toLowerCase();
    this.alergenos = json.Alergenos;
    this.calorias = json.ValorCalorico;
    return this;
  }

  fromJson(json: any) {
    this.nome = json.nome;
    this.tipo = json.tipo;
    this.alergenos = json.alergenos;
    this.calorias = json.calorias;
    return this;
  }
}