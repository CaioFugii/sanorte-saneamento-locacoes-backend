import {
  add,
  differenceInDays,
  differenceInHours,
  isBefore,
  parseISO,
} from "date-fns";
import { format as formatTz } from "date-fns-tz";
import { ServicesRepository } from "../repository/services.repository";
import { HttpError } from "../shared/http-error";

const mappedServices = {
  "VAZAMENTO DE ÁGUA COM INFILTRAÇÃO": "ARSESP - AGUA",
  "VAZAMENTO DE ÁGUA LEITO TERRA": "ARSESP - AGUA",
  "VAZAMENTO DE ÁGUA NO PASSEIO": "ARSESP - AGUA",
  "VAZAMENTO DE ÁGUA LEITO PAVIMENTADO": "ARSESP - AGUA",
  "CAVALETE VAZANDO": "ARSESP - AGUA",
  "CAVALETE QUEBRADO": "ARSESP - AGUA",
  "REGISTRO DO CAVALETE QUEBRADO": "ARSESP - AGUA",
  "REGISTRO DO CAVALETE VAZANDO": "ARSESP - AGUA",
  "TROCAR RAMAL DE ÁGUA": "ARSESP - AGUA",
  "HIDRÔMETRO VAZANDO": "ARSESP - AGUA",
  "HIDRANTE VAZANDO": "ARSESP - AGUA",
  "FALTA DE ÁGUA GERAL": "ARSESP - AGUA",
  "FALTA DE ÁGUA LOCAL": "ARSESP - AGUA",
  "POUCA PRESSÃO DE ÁGUA LOCAL": "ARSESP - AGUA",
  "POUCA PRESSÃO DE ÁGUA GERAL": "ARSESP - AGUA",
  "CONSERTO DE REDE DE ESGOTO": "ARSESP - ESGOTO",
  "CONSERTAR RAMAL DE ESGOTO": "ARSESP - ESGOTO",
  "CONSERTAR POÇO DE INSPEÇÃO/VISITA": "ARSESP - ESGOTO",
  "COLOCAR TAMPÃOEM POÇO INSPEÇÃO/VISITA": "ARSESP - ESGOTO",
  "REPOR ASFALTO": "ARSESP - REPOSIÇÃO",
  "REPOR ASFALTO INV": "ARSESP - REPOSIÇÃO",
  "REPOR ASFALTO A FRIO": "ARSESP - REPOSIÇÃO",
  "REPOR ASFALTO A FRIO INV": "ARSESP - REPOSIÇÃO",
  "REPOR CASPA ASFALTICA": "ARSESP - REPOSIÇÃO",
  "REPOR CAPA ASFALTICA INV": "ARSESP - REPOSIÇÃO",
  "REPOR PASSEIO ADJACENTE ESPECIAL": "ARSESP - REPOSIÇÃO",
  "REPOR PASSEIO ADJACENTE ESPECIAL INV": "ARSESP - REPOSIÇÃO",
  "REPOR PASSEIO ADJACENTE CIMENTADO": "ARSESP - REPOSIÇÃO",
  "REPOR PASSEIO ADJACENTE CIMENTADO INV": "ARSESP - REPOSIÇÃO",
  "REPOR CONCRETO": "ARSESP - REPOSIÇÃO",
  "REPOR PISO INTERNO CIMENTADO": "ARSESP - REPOSIÇÃO",
  "REPOR PISO INTERNO CIMENTADO INV": "ARSESP - REPOSIÇÃO",
  "REPOR PISO INTERNO ESPECIAL": "ARSESP - REPOSIÇÃO",
  "REPOR PISO INTERNO ESPECIAL INV": "ARSESP - REPOSIÇÃO",
  "REPOR SARJETA": "ARSESP - REPOSIÇÃO",
  "REPOR SARJETA INV": "ARSESP - REPOSIÇÃO",
  "REPOR GUIA": "ARSESP - REPOSIÇÃO",
  "REPOR GUIA INV": "ARSESP - REPOSIÇÃO",
  "REPOR BLOQUETE": "ARSESP - REPOSIÇÃO",
  "REPOR BLOQUETE INV": "ARSESP - REPOSIÇÃO",
  "REPOR PASSEIO OPOSTO CIMENTADO": "ARSESP - REPOSIÇÃO",
  "REPOR PASSEIO OPOSTO CIMENTADO INV": "ARSESP - REPOSIÇÃO",
  "REPOR PASSEIO OPOSTO ESPECIAL": "ARSESP - REPOSIÇÃO",
  "REPOR PASSEIO OPOSTO ESPECIAL INV": "ARSESP - REPOSIÇÃO",
  "INCLUIR LIG DE ÁGUA EM CAV MÚLTIPLO S/V": "LIGAÇÃO DE AGUA",
  "LIGAÇÃO DE ÁGUA DIMENSIONADA": "LIGAÇÃO DE AGUA",
  "LIGAÇÃO DE ÁGUA DIMENSIONADA S/V": "LIGAÇÃO DE AGUA",
  "LIGAÇÃO DE ÁGUA EM CAV MULTIPLO": "LIGAÇÃO DE AGUA",
  "LIGAÇÃO DE ÁGUA S/V": "LIGAÇÃO DE AGUA",
  "SUBSTITUIR LIGAÇÃO DE AGUA": "LIGAÇÃO DE AGUA",
  "SUBSTITUIÇÃO DE CAVALETE PARA UMA": "LIGAÇÃO DE AGUA",
  "LIGAÇÃO DE ESGOTO": "LIGAÇÃO DE ESGOTO",
  "LIGAÇÃO DE ESGOTO ADIOCIONAL": "LIGAÇÃO DE ESGOTO",
  "LIGAÇÃO DE ESGOTO AVULSA": "LIGAÇÃO DE ESGOTO",
  "LIGAÇÃO DE ESGOTO AVULSA S/V": "LIGAÇÃO DE ESGOTO",
  "LIGAÇÃO DE ESGOTO S/V": "LIGAÇÃO DE ESGOTO",
  "SUBSTITUIR LIGAÇÃO DE ESGOTO": "LIGAÇÃO DE ESGOTO",
  "CONSTRUIR POÇO DE VISITA": "ESGOTO - GERAL",
  "CONSTRUIR POÇO DE INSPEÇÃO": "ESGOTO - GERAL",
  "DESCOBRIR POÇO INSPEÇÃO/VISITA": "ESGOTO - GERAL",
  "DESCOBRIR TERMINAL DE LIMPEZA": "ESGOTO - GERAL",
  "NIVELAR POÇO DE INSPEÇÃO/VISITA": "ESGOTO - GERAL",
  "NIVELAR TERMINAL DE LIMPEZA": "ESGOTO - GERAL",
  "PROLONGAR REDE DE ESGOTO": "ESGOTO - GERAL",
  "REMANEJAR REDE DE ESGOTO": "ESGOTO - GERAL",
  "RETIRAR ENTULHO": "ESGOTO - GERAL",
  "SONDAR RAMAL DE ESGOTO": "ESGOTO - GERAL",
  "SONDAR REDE DE ESGOTO": "ESGOTO - GERAL",
  "TROCAR RAMAL DE ESGOTO": "ESGOTO - GERAL",
  "LIGAÇÃO DE ESGOTO ADICIONAL": "ESGOTO - GERAL",
  "TROCAR SOLO": "ESGOTO - GERAL",
  "TROCAR SOLO INV": "ESGOTO - GERAL",
  "TESTE DE CORANTE OP": "ESGOTO - GERAL",
  "HIDRÔMETRO PARADO": "AGUA - GERAL",
  "TROCAR HIDRÔMETRO PREVENTIVA": "AGUA - GERAL",
  "HIDRÔMETRO EMBAÇADO": "AGUA - GERAL",
  "HIDRÔMETRO INVERTIDO": "AGUA - GERAL",
  "HIDRÔMETRO QUEBRADO": "AGUA - GERAL",
  "INSTALAR HIDRÔMETRO DESAPARECIDO/FURTADO": "AGUA - GERAL",
  "TROCAR CAVALETE POR UMA": "AGUA - GERAL",
  "TROCAR CAVALETE (KIT)": "AGUA - GERAL",
  "READEQUAR CAVALETE": "AGUA - GERAL",
  "REATIVAR LIGAÇÃO DE ÁGUA S/V": "AGUA - GERAL",
  "RELIGAR ÁGUA A PEDIDO DO CLIENTE": "AGUA - GERAL",
  "RESTABELECER LIGAÇÃO MUDAN TITULARID OP": "AGUA - GERAL",
  "RESTABELECER LIGAÇÃO OP": "AGUA - GERAL",
  "RELIGAR ÁGUA DEB OP": "AGUA - GERAL",
  "RELIGAR AGUA IMPEDIMENTO DE LEITURA": "AGUA - GERAL",
  "RELIGAR AGUA MUDANÇA TITULARIDADE": "AGUA - GERAL",
  "PROLONGAR REDE DE ÁGUA": "AGUA - GERAL",
  "REMANEJAR REDE DE ÁGUA": "AGUA - GERAL",
  "SONDAR RAMAL DE ÁGUA": "AGUA - GERAL",
  "SONDAR REDE DE ÁGUA": "AGUA - GERAL",
  "SUPRIMIR LIG AGUA DEMOLIÇÃO/UNIFICAÇÃO": "AGUA - GERAL",
  "SUPRIMIR LIG AGUA ENCERRAMENTO CONTRATO": "AGUA - GERAL",
  "SUPRIMIR LIGAÇÃO DE AGUA POR IMOVEL VAGO": "AGUA - GERAL",
  "TROCAR RAMAL DE ÁGUA PREVENTIVA": "AGUA - GERAL",
  "TROCAR RAMAL DE ÁGUA - VAZ NÃO VISIVEL": "AGUA - GERAL",
  "VAZAMENTO DE ÁGUA NÃO VISÍVEL CAVALETE": "AGUA - GERAL",
  "VAZAMENTO DE ÁGUA NÃO VISÍVEL RAMAL": "AGUA - GERAL",
  "VAZAMENTO DE ÁGUA NÃO VISÍVEL REDE": "AGUA - GERAL",
  "INSTALAR LACRE DIVERSOS": "AGUA - GERAL",
  "INSTALAR LACRE NUMERADO": "AGUA - GERAL",
  "REGULARIZAR CAVALETE": "AGUA - GERAL",
  "SUBSTITUIR TAMPA DE CAIXA UMA": "AGUA - GERAL",
  "INTERLIGAR REDE DE ÁGUA": "AGUA - GERAL",
  "INSTALAR VÁLVULA DE REDE DE ÁGUA": "AGUA - GERAL",
  "DESCARGA EM REDE DE ÁGUA": "AGUA - GERAL",
  "VERIFICAR SERVIÇO SOLICITADO": "AGUA - GERAL",
  "HIDROMETRO VAZANDO": "AGUA - GERAL",
  "RESTABELECER LIGAÇÃO SERVIÇOS ADICIONAIS": "AGUA - GERAL",
  "MUITA PRESSÃO DE ÁGUA": "AGUA - GERAL",
  "VISTORIA DE ENCERRAMENTO CONTRATUAL": "AGUA - GERAL",
};

const mappedMetrics = {
  "ARSESP - AGUA": {
    type: "horas",
    values: [24, 48, 96],
  },
  "ARSESP - ESGOTO": {
    type: "horas",
    values: [24, 48, 96],
  },
  "ARSESP - REPOSIÇÃO": {
    type: "dias",
    values: [6, 20],
  },
  "LIGAÇÃO DE AGUA": {
    type: "dias",
    values: [10],
  },
  "LIGAÇÃO DE ESGOTO": {
    type: "dias",
    values: [10],
  },
};
export class ListCompletedServicesUseCase {
  constructor(private repository: ServicesRepository) {}
  async execute(filter: {
    location: string[];
    range: { from: string; to: string };
  }) {
    if (!filter.range.from || !filter.range.to) {
      throw new HttpError("Range of dates is required", 400);
    }

    const filterDate = {
      from: add(new Date(filter.range?.from), { hours: 3 }),
      to: add(new Date(filter.range?.to), { hours: 26, minutes: 58 }),
    };

    const valid = ListCompletedServicesUseCase.validateDates(filterDate);

    if (!valid) {
      throw new HttpError("Invalid dates", 400);
    }

    const resultMalFormatted = await this.repository.find({
      location: filter.location,
      range: {
        from: ListCompletedServicesUseCase.formatDate(filterDate.from),
        to: ListCompletedServicesUseCase.formatDate(filterDate.to),
      },
    });

    const resultWithType = resultMalFormatted.map(
      ListCompletedServicesUseCase.mapTypeService
    );
    const result = [];

    Object.keys(mappedMetrics).forEach((type) => {
      const summary = mappedMetrics[type].values.reduce(
        (a, v) => ({ ...a, [`até ${v} ${mappedMetrics[type].type}`]: 0 }),
        { late: 0, total: 0 }
      );

      let collection = {
        tableName: type,
        summary,
        values: [],
      };
      collection.values = resultWithType.filter((item) => item.type === type);
      if (collection.values.length) {
        result.push(collection);
      }
    });

    return ListCompletedServicesUseCase.updateSummary(result);
  }

  static validateDates(range: { from: Date; to: Date }): boolean {
    if (isBefore(range.to, range.from)) {
      return false;
    }

    if (differenceInDays(range.to, range.from) >= 32) {
      return false;
    }
    return true;
  }

  static formatDate(date: Date): string {
    return formatTz(date, "yyyy-MM-dd HH:mm:ss", {
      timeZone: "America/Sao_Paulo",
    });
  }

  static mapTypeService(data: {
    origin: string;
    order_service: string;
    tss: string;
    start_date: string;
    finish_date: string;
    address: string;
    city: string;
    status: string;
    result: string;
    created_at: string;
  }) {
    const type = mappedServices[data.tss] ?? "AGUA - GERAL";

    return {
      ...data,
      start_date: formatTz(data.start_date, "yyyy-MM-dd HH:mm:ss", {
        timeZone: "America/Sao_Paulo",
      }),
      finish_date: formatTz(data.finish_date, "yyyy-MM-dd HH:mm:ss", {
        timeZone: "America/Sao_Paulo",
      }),
      type,
    };
  }

  static updateSummary(dataArray: any[]) {
    dataArray.forEach((data) => {
      data.values.forEach((value, index) => {
        let classification = "";
        const startDate = parseISO(value.start_date);
        const finishDate = parseISO(value.finish_date);

        if (data.tableName === "ARSESP - AGUA") {
          const duration = differenceInHours(finishDate, startDate);
          if (duration > 96) {
            data.summary["late"] += 1;
            classification = "late";
          } else if (duration <= 24) {
            data.summary["até 24 horas"] += 1;
            classification = "até 24 horas";
          } else if (duration <= 48) {
            data.summary["até 48 horas"] += 1;
            classification = "até 48 horas";
          } else if (duration <= 96) {
            data.summary["até 96 horas"] += 1;
            classification = "até 96 horas";
          }
          data.summary["total"] += 1;
        } else if (data.tableName === "ARSESP - ESGOTO") {
          const duration = differenceInHours(finishDate, startDate);
          if (duration > 96) {
            data.summary["late"] += 1;
            classification = "late";
          } else if (duration <= 24) {
            data.summary["até 24 horas"] += 1;
            classification = "até 24 horas";
          } else if (duration <= 48) {
            data.summary["até 48 horas"] += 1;
            classification = "até 48 horas";
          } else if (duration <= 96) {
            data.summary["até 96 horas"] += 1;
            classification = "até 96 horas";
          }
          data.summary["total"] += 1;
        } else if (data.tableName === "ARSESP - REPOSIÇÃO") {
          const duration = differenceInDays(finishDate, startDate);
          if (duration > 20) {
            data.summary["late"] += 1;
            classification = "late";
          } else if (duration <= 6) {
            data.summary["até 6 dias"] += 1;
            classification = "até 6 dias";
          } else if (duration <= 20) {
            data.summary["até 20 dias"] += 1;
            classification = "até 20 dias";
          }
          data.summary["total"] += 1;
        } else if (data.tableName === "LIGAÇÃO DE AGUA") {
          const duration = differenceInDays(finishDate, startDate);
          if (duration > 10) {
            data.summary["late"] += 1;
            classification = "late";
          } else if (duration <= 10) {
            data.summary["até 10 dias"] += 1;
            classification = "até 10 dias";
          }
          data.summary["total"] += 1;
        } else if (data.tableName === "LIGAÇÃO DE ESGOTO") {
          const duration = differenceInDays(finishDate, startDate);
          if (duration > 10) {
            data.summary["late"] += 1;
            classification = "late";
          } else if (duration <= 10) {
            data.summary["até 10 dias"] += 1;
            classification = "até 10 dias";
          }
          data.summary["total"] += 1;
        }

        data.values[index].classification = classification;
        //falta agua geral e esgoto geral
      });
    });

    return dataArray;
  }
}
