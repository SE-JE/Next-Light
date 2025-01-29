export function CurrencyFormatComponent(
  value: string,
  locale = "id-ID",
  currency = "IDR"
) {
  const numberValue = parseFloat(value.replace(/[^0-9]/g, "")) || 0;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(numberValue);
}
