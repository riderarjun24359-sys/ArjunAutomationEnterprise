export const formatDate = (value: string | Date, locale = "en") =>
    new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(typeof value === "string" ? new Date(value) : value);

export const sleep = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
