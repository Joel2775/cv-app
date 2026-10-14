export const requiredField = (label: string) => (value: string) =>
  value.trim().length > 0 || `Ingrese ${label}.`;

export const maxLength = (limit: number) => (value: string) =>
  value.length <= limit || `No puede superar los ${limit} caracteres.`;

export const emailValidator = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ||
  "Ingrese un correo electrónico válido.";

export const phoneValidator = (value: string) => {
  if (!value.trim()) {
    return true;
  }

  const digits = value.replace(/\D/g, "");
  return (
    (/^\+?[\d\s()-]+$/.test(value) &&
      digits.length >= 7 &&
      digits.length <= 15) ||
    "Ingrese un número válido."
  );
};

export const graduationYearValidator = (value: string) => {
  if (!value) {
    return true;
  }

  const year = Number(value);
  return (
    (/^\d{4}$/.test(value) && year >= 1900 && year <= 2100) ||
    "Ingrese un año válido."
  );
};

export const endDateValidator = (startDate: string) => (endDate: string) => {
  if (!endDate) {
    return true;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    return "Seleccione una fecha de fin válida.";
  }

  if (!startDate || !/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
    return true;
  }

  return (
    endDate.slice(0, 7) >= startDate.slice(0, 7) ||
    "La fecha de fin no puede ser anterior a la fecha de inicio."
  );
};
