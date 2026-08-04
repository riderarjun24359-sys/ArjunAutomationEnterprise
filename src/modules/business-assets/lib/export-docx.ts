"use client";

export interface DocxExportOptions {
    title: string;
    html: string;
    filename?: string;
}

export function exportToDocx(options: DocxExportOptions): Blob {
    const html = options.html.startsWith("<!DOCTYPE")
        ? options.html
        : `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"/><title>${options.title}</title></head><body>${options.html}</body></html>`;
    return new Blob([html], { type: "application/msword" });
}

export function downloadDocx(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename.endsWith(".doc") ? filename : `${filename}.doc`;
    a.click();
    URL.revokeObjectURL(url);
}
