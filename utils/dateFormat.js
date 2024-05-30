const daysOfWeek = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export const formatDateInterval = (date, startTime, endTime) => {
  const dateObj = new Date(date);
  const startDateTime = new Date(`${date}T${startTime}`);
  const endDateTime = new Date(`${date}T${endTime}`);

  const dayOfWeek = daysOfWeek[dateObj.getDay() + 1];
  const day = dateObj.getDate() + 1;
  const month = months[dateObj.getMonth()];

  const timeOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const startFormatted = new Intl.DateTimeFormat("es-ES", timeOptions).format(
    startDateTime
  );
  const endFormatted = new Intl.DateTimeFormat("es-ES", timeOptions).format(
    endDateTime
  );

  return `${dayOfWeek} ${day} de ${month}, ${startFormatted} a ${endFormatted}`;
};

export const formatDate = (date) => {
  const dateObj = new Date(date);

  const dayOfWeek = daysOfWeek[dateObj.getDay() + 1];
  const day = dateObj.getDate() + 1;
  const month = months[dateObj.getMonth()];

  return `${dayOfWeek} ${day} de ${month}`;
};
