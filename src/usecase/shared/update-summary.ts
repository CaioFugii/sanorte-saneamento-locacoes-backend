import { differenceInDays, differenceInHours, parseISO } from "date-fns";

export const updateSummary = (dataArray: any[]) => {
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
        if (duration >= 20) {
          data.summary["Atrasados"] += 1;
          classification = "Atrasados";
        } else if (duration < 6) {
          data.summary["até 6 dias"] += 1;
          classification = "até 6 dias";
        } else if (duration < 20) {
          data.summary["até 20 dias"] += 1;
          classification = "até 20 dias";
        }
        data.summary["Total"] += 1;
      } else if (data.tableName === "LIGAÇÃO DE AGUA") {
        const duration = differenceInDays(finishDate, startDate);
        if (duration >= 10) {
          data.summary["Atrasados"] += 1;
          classification = "Atrasados";
        } else if (duration < 10) {
          data.summary["até 10 dias"] += 1;
          classification = "até 10 dias";
        }
        data.summary["Total"] += 1;
      } else if (data.tableName === "LIGAÇÃO DE ESGOTO") {
        const duration = differenceInDays(finishDate, startDate);
        if (duration >= 10) {
          data.summary["Atrasados"] += 1;
          classification = "Atrasados";
        } else if (duration < 10) {
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
      } else if (data.tableName === "HIDRO CORRETIVO/ RELIGAÇÕES - 48 HORAS") {
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
        if (duration >= 3) {
          data.summary["Atrasados"] += 1;
          classification = "Atrasados";
        } else if (duration < 3) {
          data.summary["até 3 dias"] += 1;
          classification = "até 3 dias";
        }
        data.summary["Total"] += 1;
      } else if (data.tableName === "AGUA - GERAL - 7 DIAS") {
        const duration = differenceInDays(finishDate, startDate);
        if (duration >= 7) {
          data.summary["Atrasados"] += 1;
          classification = "Atrasados";
        } else if (duration < 7) {
          data.summary["até 7 dias"] += 1;
          classification = "até 7 dias";
        }
        data.summary["Total"] += 1;
      } else if (data.tableName === "AGUA - GERAL - 9 DIAS") {
        const duration = differenceInDays(finishDate, startDate);
        if (duration >= 9) {
          data.summary["Atrasados"] += 1;
          classification = "Atrasados";
        } else if (duration < 9) {
          data.summary["até 9 dias"] += 1;
          classification = "até 9 dias";
        }
        data.summary["Total"] += 1;
      } else if (
        data.tableName === "CAVALETES/ SUPRESSÕES/ INVESTIMENTO - 10 DIAS"
      ) {
        const duration = differenceInDays(finishDate, startDate);
        if (duration >= 10) {
          data.summary["Atrasados"] += 1;
          classification = "Atrasados";
        } else if (duration < 10) {
          data.summary["até 10 dias"] += 1;
          classification = "até 10 dias";
        }
        data.summary["Total"] += 1;
      } else if (
        data.tableName === "PROLONGAMENTO/ HIDRO PREVENTIVO - 30 DIAS"
      ) {
        const duration = differenceInDays(finishDate, startDate);
        if (duration >= 30) {
          data.summary["Atrasados"] += 1;
          classification = "Atrasados";
        } else if (duration < 30) {
          data.summary["até 30 dias"] += 1;
          classification = "até 30 dias";
        }
        data.summary["Total"] += 1;
      } else if (
        data.tableName === "TROCA DE RAMAL/ SONDAGENS/ SOLO/ ENTULHO - 3 DIAS"
      ) {
        const duration = differenceInDays(finishDate, startDate);
        if (duration >= 3) {
          data.summary["Atrasados"] += 1;
          classification = "Atrasados";
        } else if (duration < 3) {
          data.summary["até 3 dias"] += 1;
          classification = "até 3 dias";
        }
        data.summary["Total"] += 1;
      } else if (
        data.tableName === "CONSTRUÇÕES DE PV/ DESCOBRIR / NIVELAR - 9 DIAS"
      ) {
        const duration = differenceInDays(finishDate, startDate);
        if (duration >= 9) {
          data.summary["Atrasados"] += 1;
          classification = "Atrasados";
        } else if (duration < 9) {
          data.summary["até 9 dias"] += 1;
          classification = "até 9 dias";
        }
        data.summary["Total"] += 1;
      } else if (data.tableName === "PROLONGAMENTOS - 30 DIAS") {
        const duration = differenceInDays(finishDate, startDate);
        if (duration >= 30) {
          data.summary["Atrasados"] += 1;
          classification = "Atrasados";
        } else if (duration < 30) {
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
};
