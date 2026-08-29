type QuoteRecord = Record<string, unknown> & { id: string };

function firstValue(quote: QuoteRecord, keys: string[]) {
  for (const key of keys) {
    const value = quote[key];
    if (Array.isArray(value) && value.length === 0) continue;
    if (value !== null && value !== undefined && value !== "") return value;
  }
  return undefined;
}

function textValue(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean).join(", ") || "Not provided";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value.trim() || "Not provided";
  if (value && typeof value === "object") {
    const record = value as { toDate?: () => Date };
    if (typeof record.toDate === "function") {
      const date = record.toDate();
      if (date instanceof Date && !Number.isNaN(date.getTime())) {
        return new Intl.DateTimeFormat("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).format(date);
      }
    }
    return JSON.stringify(value);
  }
  return "Not provided";
}

function formatColors(value: unknown) {
  const colors = Array.isArray(value)
    ? value.map((color) => String(color).trim()).filter(Boolean)
    : String(value ?? "").split(/[,/]/).map((color) => color.trim()).filter(Boolean);
  return colors.join(", ") || "Not provided";
}

function formatSize(quote: QuoteRecord) {
  const widthValue = firstValue(quote, ["width"]);
  const heightValue = firstValue(quote, ["height"]);
  const width = textValue(widthValue);
  const height = textValue(heightValue === 0 || heightValue === "0" ? widthValue : heightValue);
  return `(Width) ${width} * (Height)${height} Inches`;
}

function combineValues(quote: QuoteRecord, keys: string[]) {
  const values = keys.flatMap((key) => {
    const value = quote[key];
    if (Array.isArray(value)) return value;
    return value === null || value === undefined || value === "" ? [] : [value];
  });
  return values.length ? values : undefined;
}

export function createQuoteText(quote: QuoteRecord) {
  const rows: Array<[string, string]> = [];
  const addRow = (label: string, keys: string[], formatter = textValue) => {
    const value = firstValue(quote, keys);
    if (value !== undefined) rows.push([`${label}:`, formatter(value)]);
  };

  addRow("Design ID", ["designId", "orderNumber", "id"]);
  addRow("Order Type", ["orderType"]);
  addRow("Design Name", ["designName"]);
  const outputFormats = combineValues(quote, ["outputFormats", "outputFormatOther"]);
  if (outputFormats) rows.push(["Output Formats:", formatColors(outputFormats)]);
  addRow("Fabric Type", ["fabricType"]);
  addRow("Placement Area", ["placementArea"]);
  addRow("Unit", ["unitSelect", "unitType"]);
  if ((quote.width !== undefined && quote.width !== "") || (quote.height !== undefined && quote.height !== "")) {
    rows.push(["Design Size:", formatSize(quote)]);
  }
  addRow("No Of Colors", ["numberOfColors"]);
  addRow("Colors Names", ["colorsName"], formatColors);
  const colorway = quote.colorwayToUse === "other" ? quote.colorwayToUseOther : quote.colorwayToUse;
  if (colorway !== undefined && colorway !== null && colorway !== "") {
    rows.push(["Colorway To Use:", textValue(colorway)]);
  }
  addRow("Applique Required", ["appliqueRequired"]);
  addRow("Customer Comments", ["additionalNotes"]);
  addRow("Turn Around Time", ["turnaroundTime"]);

  const labelWidth = Math.max(...rows.map(([label]) => label.length)) + 5;
  return rows.map(([label, value]) => `${label.padEnd(labelWidth)}${value}`).join("\n\n") + "\n";
}
