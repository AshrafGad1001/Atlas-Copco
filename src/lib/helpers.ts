export const displayName = (company?: { nameAr?: string; nameEn?: string }) => company?.nameAr || company?.nameEn || "—";

export const formatDateTime = (dateVal: any) => {
  if (!dateVal) return "—";
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "—";
    const formatter = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Cairo", hour12: false, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
    const formatted = formatter.format(d).replace(",", ""); // en-GB format sometimes includes comma between date and time
    return formatted;
  } catch(e) { return "—"; }
};

export const formatDate = (dateVal: any) => {
  if (!dateVal) return "—";
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "—";
    const formatter = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Cairo", year: "numeric", month: "2-digit", day: "2-digit" });
    return formatter.format(d);
  } catch(e) { return "—"; }
};