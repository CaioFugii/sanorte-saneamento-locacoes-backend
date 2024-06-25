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
  "ARREBENTADO DE REDE DE AGUA": "ARSESP - AGUA",
  "VAZAMENTO DE ÁGUA COM INFILTRAÇÃO": "ARSESP - AGUA",
  "VAZAMENTO DE ÁGUA LEITO TERRA": "ARSESP - AGUA",
  "VAZAMENTO DE ÁGUA NO PASSEIO": "ARSESP - AGUA",
  "VAZAMENTO DE ÁGUA LEITO PAVIMENTADO": "ARSESP - AGUA",
  "CAVALETE VAZANDO": "ARSESP - AGUA",
  "CAVALETE QUEBRADO": "ARSESP - AGUA",
  "REGISTRO DO CAVALETE QUEBRADO":
    "FALTA D'AGUA / HIDRO FURTADO/ CAVALETE CORRETIVO - 24 HORAS",
  "REGISTRO DO CAVALETE VAZANDO": "ARSESP - AGUA",
  "TROCAR RAMAL DE ÁGUA": "ARSESP - AGUA",
  "HIDROMETRO VAZANDO": "ARSESP - AGUA",
  "HIDRÔMETRO VAZANDO": "ARSESP - AGUA",
  "HIDRANTE VAZANDO": "ARSESP - AGUA",
  "FALTA DE ÁGUA GERAL":
    "FALTA D'AGUA / HIDRO FURTADO/ CAVALETE CORRETIVO - 24 HORAS",
  "FALTA DE ÁGUA LOCAL":
    "FALTA D'AGUA / HIDRO FURTADO/ CAVALETE CORRETIVO - 24 HORAS",
  "POUCA PRESSÃO DE ÁGUA LOCAL":
    "FALTA D'AGUA / HIDRO FURTADO/ CAVALETE CORRETIVO - 24 HORAS",
  "POUCA PRESSÃO DE ÁGUA GERAL":
    "FALTA D'AGUA / HIDRO FURTADO/ CAVALETE CORRETIVO - 24 HORAS",
  "CONSERTO DE REDE DE ESGOTO": "ARSESP - ESGOTO",
  "CONSERTO DE RAMAL DE ESGOTO": "ARSESP - ESGOTO",
  "CONSERTAR RAMAL DE ESGOTO": "ARSESP - ESGOTO",
  "CONSERTAR POÇO DE INSPEÇÃO/VISITA": "ARSESP - ESGOTO",
  "COLOCAR TAMPÃOEM POÇO INSPEÇÃO/VISITA": "ARSESP - ESGOTO",
  "TROCAR TERMINAL DE LIMPEZA": "ARSESP - ESGOTO",
  "DESOBSTRUIR REDE DE ESGOTO": "ARSESP - ESGOTO",
  "ATERRAR VALA": "ARSESP - REPOSIÇÃO",
  "ATERRAR VALA INV": "ARSESP - REPOSIÇÃO",
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
  "REPOR SARJETA ": "ARSESP - REPOSIÇÃO",
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
  "LIGAÇÃO DE ESGOTO ADICIONAL": "LIGAÇÃO DE ESGOTO",
  "LIGAÇÃO DE ESGOTO AVULSA": "LIGAÇÃO DE ESGOTO",
  "LIGAÇÃO DE ESGOTO AVULSA S/V": "LIGAÇÃO DE ESGOTO",
  "LIGAÇÃO DE ESGOTO S/V": "LIGAÇÃO DE ESGOTO",
  "SUBSTITUIR LIGAÇÃO DE ESGOTO": "LIGAÇÃO DE ESGOTO",
  "CONSTRUIR POÇO DE VISITA": "CONSTRUÇÕES DE PV/ DESCOBRIR / NIVELAR - 9 DIAS",
  "CONSTRUIR POÇO DE INSPEÇÃO":
    "CONSTRUÇÕES DE PV/ DESCOBRIR / NIVELAR - 9 DIAS",
  "DESCOBRIR POÇO INSPEÇÃO/VISITA":
    "CONSTRUÇÕES DE PV/ DESCOBRIR / NIVELAR - 9 DIAS",
  "DESCOBRIR TERMINAL DE LIMPEZA":
    "CONSTRUÇÕES DE PV/ DESCOBRIR / NIVELAR - 9 DIAS",
  "NIVELAR POÇO DE INSPEÇÃO/VISITA":
    "CONSTRUÇÕES DE PV/ DESCOBRIR / NIVELAR - 9 DIAS",
  "NIVELAR TERMINAL DE LIMPEZA":
    "CONSTRUÇÕES DE PV/ DESCOBRIR / NIVELAR - 9 DIAS",
  "TESTE DE CORANTE OP": "CONSTRUÇÕES DE PV/ DESCOBRIR / NIVELAR - 9 DIAS",
  "PROLONGAR REDE DE ESGOTO": "PROLONGAMENTOS - 30 DIAS",
  "REMANEJAR REDE DE ESGOTO": "PROLONGAMENTOS - 30 DIAS",
  "RETIRAR ENTULHO": "TROCA DE RAMAL/ SONDAGENS/ SOLO/ ENTULHO - 3 DIAS",
  "SONDAR RAMAL DE ESGOTO": "TROCA DE RAMAL/ SONDAGENS/ SOLO/ ENTULHO - 3 DIAS",
  "SONDAR REDE DE ESGOTO": "TROCA DE RAMAL/ SONDAGENS/ SOLO/ ENTULHO - 3 DIAS",
  "TROCAR RAMAL DE ESGOTO": "TROCA DE RAMAL/ SONDAGENS/ SOLO/ ENTULHO - 3 DIAS",
  "TROCAR SOLO": "TROCA DE RAMAL/ SONDAGENS/ SOLO/ ENTULHO - 3 DIAS",
  "TROCAR SOLO INV": "TROCA DE RAMAL/ SONDAGENS/ SOLO/ ENTULHO - 3 DIAS",
  "HIDRÔMETRO PARADO": "HIDRO CORRETIVO/ RELIGAÇÕES - 48 HORAS",
  "HIDRÔMETRO EMBAÇADO": "HIDRO CORRETIVO/ RELIGAÇÕES - 48 HORAS",
  "HIDRÔMETRO INVERTIDO": "HIDRO CORRETIVO/ RELIGAÇÕES - 48 HORAS",
  "HIDRÔMETRO QUEBRADO": "HIDRO CORRETIVO/ RELIGAÇÕES - 48 HORAS",
  "INSTALAR HIDRÔMETRO DESAPARECIDO/FURTADO":
    "FALTA D'AGUA / HIDRO FURTADO/ CAVALETE CORRETIVO - 24 HORAS",
  "TROCAR CAVALETE (KIT)": "TROCA KIT/ SONDAGENS/ NÃO VISIVEIS - 3 DIAS",
  "REATIVAR LIGAÇÃO DE ÁGUA S/V": "HIDRO CORRETIVO/ RELIGAÇÕES - 48 HORAS",
  "RELIGAR ÁGUA A PEDIDO DO CLIENTE": "HIDRO CORRETIVO/ RELIGAÇÕES - 48 HORAS",
  "RESTABELECER LIGAÇÃO MUDAN TITULARID OP":
    "HIDRO CORRETIVO/ RELIGAÇÕES - 48 HORAS",
  "RESTABELECER LIGAÇÃO OP": "HIDRO CORRETIVO/ RELIGAÇÕES - 48 HORAS",
  "RELIGAR ÁGUA DEB OP": "HIDRO CORRETIVO/ RELIGAÇÕES - 48 HORAS",
  "RELIGAR AGUA IMPEDIMENTO DE LEITURA":
    "HIDRO CORRETIVO/ RELIGAÇÕES - 48 HORAS",
  "RELIGAR AGUA MUDANÇA TITULARIDADE": "HIDRO CORRETIVO/ RELIGAÇÕES - 48 HORAS",
  "SONDAR RAMAL DE ÁGUA": "TROCA KIT/ SONDAGENS/ NÃO VISIVEIS - 3 DIAS",
  "SONDAR REDE DE ÁGUA": "TROCA KIT/ SONDAGENS/ NÃO VISIVEIS - 3 DIAS",
  "SUPRIMIR LIG AGUA DEMOLIÇÃO/UNIFICAÇÃO":
    "CAVALETES/ SUPRESSÕES/ INVESTIMENTO - 10 DIAS",
  "SUPRIMIR RAMAL EM SUBST DE LIGAÇÃO ÁGUA":
    "CAVALETES/ SUPRESSÕES/ INVESTIMENTO - 10 DIAS",
  "SUPRIMIR LIGAÇÃO DE ÁGUA POR DEBITO OP":
    "CAVALETES/ SUPRESSÕES/ INVESTIMENTO - 10 DIAS",
  "SUPRIMIR LIG AGUA ENCERRAMENTO CONTRATO":
    "CAVALETES/ SUPRESSÕES/ INVESTIMENTO - 10 DIAS",
  "SUPRIMIR LIGAÇÃO DE ÁGUA IRREG":
    "CAVALETES/ SUPRESSÕES/ INVESTIMENTO - 10 DIAS",
  "SUPRIMIR LIGAÇÃO DE AGUA POR IMOVEL VAGO":
    "CAVALETES/ SUPRESSÕES/ INVESTIMENTO - 10 DIAS",
  "TROCAR RAMAL DE ÁGUA PREVENTIVA":
    "TROCA KIT/ SONDAGENS/ NÃO VISIVEIS - 3 DIAS",
  "TROCAR RAMAL DE ÁGUA - VAZ NÃO VISIVEL":
    "TROCA KIT/ SONDAGENS/ NÃO VISIVEIS - 3 DIAS",
  "VAZAMENTO DE ÁGUA NÃO VISÍVEL CAVALETE":
    "TROCA KIT/ SONDAGENS/ NÃO VISIVEIS - 3 DIAS",
  "VAZAMENTO DE ÁGUA NÃO VISÍVEL RAMAL":
    "TROCA KIT/ SONDAGENS/ NÃO VISIVEIS - 3 DIAS",
  "VAZAMENTO DE ÁGUA NÃO VISÍVEL REDE":
    "TROCA KIT/ SONDAGENS/ NÃO VISIVEIS - 3 DIAS",
  "TROCAR HIDRÔMETRO PREVENTIVA": "PROLONGAMENTO/ HIDRO PREVENTIVO - 30 DIAS",
  "TROCAR HIDRÔMETRO PREVENTIVA AGENDADA":
    "PROLONGAMENTO/ HIDRO PREVENTIVO - 30 DIAS",
  "TROCAR HIDRÔMETRO PREVENTIVA AGENDADA":
    "PROLONGAMENTO/ HIDRO PREVENTIVO - 30 DIAS",
  "TROCAR CAVALETE POR UMA": "CAVALETES/ SUPRESSÕES/ INVESTIMENTO - 10 DIAS",
  "INSTALAR LACRE DIVERSOS": "CAVALETES/ SUPRESSÕES/ INVESTIMENTO - 10 DIAS",
  "INSTALAR LACRE NUMERADO": "CAVALETES/ SUPRESSÕES/ INVESTIMENTO - 10 DIAS",
  "REGULARIZAR CAVALETE": "CAVALETES/ SUPRESSÕES/ INVESTIMENTO - 10 DIAS",
  "VERIFICAR SERVIÇO SOLICITADO":
    "CAVALETES/ SUPRESSÕES/ INVESTIMENTO - 10 DIAS",
  "RESTABELECER LIGAÇÃO SERVIÇOS ADICIONAIS":
    "CAVALETES/ SUPRESSÕES/ INVESTIMENTO - 10 DIAS",
  "MUITA PRESSÃO DE ÁGUA": "CAVALETES/ SUPRESSÕES/ INVESTIMENTO - 10 DIAS",
  "VISTORIA DE ENCERRAMENTO CONTRATUAL":
    "CAVALETES/ SUPRESSÕES/ INVESTIMENTO - 10 DIAS",
  "INTERLIGAR REDE DE ÁGUA": "CAVALETES/ SUPRESSÕES/ INVESTIMENTO - 10 DIAS",
  "INSTALAR VÁLVULA DE REDE DE ÁGUA":
    "CAVALETES/ SUPRESSÕES/ INVESTIMENTO - 10 DIAS",
  "DESCARGA EM REDE DE ÁGUA": "CAVALETES/ SUPRESSÕES/ INVESTIMENTO - 10 DIAS",
  "READEQUAR CAVALETE": "CAVALETES/ SUPRESSÕES/ INVESTIMENTO - 10 DIAS",
  "SUBSTITUIR TAMPA DE CAIXA UMA":
    "CAVALETES/ SUPRESSÕES/ INVESTIMENTO - 10 DIAS",
  "PROLONGAR REDE DE ÁGUA": "PROLONGAMENTO/ HIDRO PREVENTIVO - 30 DIAS",
  "REMANEJAR REDE DE ÁGUA": "PROLONGAMENTO/ HIDRO PREVENTIVO - 30 DIAS",
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
  "FALTA D'AGUA / HIDRO FURTADO/ CAVALETE CORRETIVO - 24 HORAS": {
    type: "horas",
    values: [24],
  },
  "HIDRO CORRETIVO/ RELIGAÇÕES - 48 HORAS": {
    type: "horas",
    values: [48],
  },
  "TROCA KIT/ SONDAGENS/ NÃO VISIVEIS - 3 DIAS": {
    type: "dias",
    values: [3],
  },
  "AGUA - GERAL - 7 DIAS": {
    type: "dias",
    values: [7],
  },
  "AGUA - GERAL - 9 DIAS": {
    type: "dias",
    values: [9],
  },
  "CAVALETES/ SUPRESSÕES/ INVESTIMENTO - 10 DIAS": {
    type: "dias",
    values: [10],
  },
  "PROLONGAMENTO/ HIDRO PREVENTIVO - 30 DIAS": {
    type: "dias",
    values: [30],
  },
  "TROCA DE RAMAL/ SONDAGENS/ SOLO/ ENTULHO - 3 DIAS": {
    type: "dias",
    values: [3],
  },
  "CONSTRUÇÕES DE PV/ DESCOBRIR / NIVELAR - 9 DIAS": {
    type: "dias",
    values: [9],
  },
  "PROLONGAMENTOS - 30 DIAS": {
    type: "dias",
    values: [30],
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

    const resultMalFormatted = await this.repository.findCompletedServices({
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
        (a, v) => ({
          ...a,
          [`até ${v} ${mappedMetrics[type].type}`]: 0,
          [`até ${v} ${mappedMetrics[type].type} - %`]: 0,
        }),
        { Atrasados: 0, [`Atrasados - %`]: 0, Total: 0 }
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
    const tssName = data.tss.trim();

    const type = mappedServices[tssName] ?? "AGUA - GERAL";

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
            data.summary["Atrasados"] += 1;
            classification = "Atrasados";
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
          data.summary["Total"] += 1;
        } else if (data.tableName === "ARSESP - ESGOTO") {
          const duration = differenceInHours(finishDate, startDate);
          if (duration > 96) {
            data.summary["Atrasados"] += 1;
            classification = "Atrasados";
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
          data.summary["Total"] += 1;
        } else if (data.tableName === "ARSESP - REPOSIÇÃO") {
          const duration = differenceInDays(finishDate, startDate);
          if (duration > 20) {
            data.summary["Atrasados"] += 1;
            classification = "Atrasados";
          } else if (duration <= 6) {
            data.summary["até 6 dias"] += 1;
            classification = "até 6 dias";
          } else if (duration <= 20) {
            data.summary["até 20 dias"] += 1;
            classification = "até 20 dias";
          }
          data.summary["Total"] += 1;
        } else if (data.tableName === "LIGAÇÃO DE AGUA") {
          const duration = differenceInDays(finishDate, startDate);
          if (duration > 10) {
            data.summary["Atrasados"] += 1;
            classification = "Atrasados";
          } else if (duration <= 10) {
            data.summary["até 10 dias"] += 1;
            classification = "até 10 dias";
          }
          data.summary["Total"] += 1;
        } else if (data.tableName === "LIGAÇÃO DE ESGOTO") {
          const duration = differenceInDays(finishDate, startDate);
          if (duration > 10) {
            data.summary["Atrasados"] += 1;
            classification = "Atrasados";
          } else if (duration <= 10) {
            data.summary["até 10 dias"] += 1;
            classification = "até 10 dias";
          }
          data.summary["Total"] += 1;
        } else if (
          data.tableName ===
          "FALTA D'AGUA / HIDRO FURTADO/ CAVALETE CORRETIVO - 24 HORAS"
        ) {
          const duration = differenceInHours(finishDate, startDate);
          if (duration > 24) {
            data.summary["Atrasados"] += 1;
            classification = "Atrasados";
          } else if (duration <= 24) {
            data.summary["até 24 horas"] += 1;
            classification = "até 24 horas";
          }
          data.summary["Total"] += 1;
        } else if (
          data.tableName === "HIDRO CORRETIVO/ RELIGAÇÕES - 48 HORAS"
        ) {
          const duration = differenceInHours(finishDate, startDate);
          if (duration > 48) {
            data.summary["Atrasados"] += 1;
            classification = "Atrasados";
          } else if (duration <= 48) {
            data.summary["até 48 horas"] += 1;
            classification = "até 48 horas";
          }
          data.summary["Total"] += 1;
        } else if (
          data.tableName === "TROCA KIT/ SONDAGENS/ NÃO VISIVEIS - 3 DIAS"
        ) {
          const duration = differenceInDays(finishDate, startDate);
          if (duration > 3) {
            data.summary["Atrasados"] += 1;
            classification = "Atrasados";
          } else if (duration <= 3) {
            data.summary["até 3 dias"] += 1;
            classification = "até 3 dias";
          }
          data.summary["Total"] += 1;
        } else if (data.tableName === "AGUA - GERAL - 7 DIAS") {
          const duration = differenceInDays(finishDate, startDate);
          if (duration > 7) {
            data.summary["Atrasados"] += 1;
            classification = "Atrasados";
          } else if (duration <= 7) {
            data.summary["até 7 dias"] += 1;
            classification = "até 7 dias";
          }
          data.summary["Total"] += 1;
        } else if (data.tableName === "AGUA - GERAL - 9 DIAS") {
          const duration = differenceInDays(finishDate, startDate);
          if (duration > 9) {
            data.summary["Atrasados"] += 1;
            classification = "Atrasados";
          } else if (duration <= 9) {
            data.summary["até 9 dias"] += 1;
            classification = "até 9 dias";
          }
          data.summary["Total"] += 1;
        } else if (
          data.tableName === "CAVALETES/ SUPRESSÕES/ INVESTIMENTO - 10 DIAS"
        ) {
          const duration = differenceInDays(finishDate, startDate);
          if (duration > 10) {
            data.summary["Atrasados"] += 1;
            classification = "Atrasados";
          } else if (duration <= 10) {
            data.summary["até 10 dias"] += 1;
            classification = "até 10 dias";
          }
          data.summary["Total"] += 1;
        } else if (
          data.tableName === "PROLONGAMENTO/ HIDRO PREVENTIVO - 30 DIAS"
        ) {
          const duration = differenceInDays(finishDate, startDate);
          if (duration > 30) {
            data.summary["Atrasados"] += 1;
            classification = "Atrasados";
          } else if (duration <= 30) {
            data.summary["até 30 dias"] += 1;
            classification = "até 30 dias";
          }
          data.summary["Total"] += 1;
        } else if (
          data.tableName === "TROCA DE RAMAL/ SONDAGENS/ SOLO/ ENTULHO - 3 DIAS"
        ) {
          const duration = differenceInDays(finishDate, startDate);
          if (duration > 3) {
            data.summary["Atrasados"] += 1;
            classification = "Atrasados";
          } else if (duration <= 3) {
            data.summary["até 3 dias"] += 1;
            classification = "até 3 dias";
          }
          data.summary["Total"] += 1;
        } else if (
          data.tableName === "CONSTRUÇÕES DE PV/ DESCOBRIR / NIVELAR - 9 DIAS"
        ) {
          const duration = differenceInDays(finishDate, startDate);
          if (duration > 9) {
            data.summary["Atrasados"] += 1;
            classification = "Atrasados";
          } else if (duration <= 9) {
            data.summary["até 9 dias"] += 1;
            classification = "até 9 dias";
          }
          data.summary["Total"] += 1;
        } else if (data.tableName === "PROLONGAMENTOS - 30 DIAS") {
          const duration = differenceInDays(finishDate, startDate);
          if (duration > 30) {
            data.summary["Atrasados"] += 1;
            classification = "Atrasados";
          } else if (duration <= 30) {
            data.summary["até 30 dias"] += 1;
            classification = "até 30 dias";
          }
          data.summary["Total"] += 1;
        }
        data.values[index].classification = classification;
      });
      const keys = Object.keys(data.summary).filter(
        (key) => key !== "Total" && !key.includes("%")
      );

      const totalItems = data.summary["Total"];

      keys.forEach((key) => {
        const quantity = data.summary[key];
        const percentage = ((quantity * 100) / totalItems).toFixed();
        data.summary[`${key} - %`] = `${percentage}%`;
      });
    });

    return dataArray;
  }
}
