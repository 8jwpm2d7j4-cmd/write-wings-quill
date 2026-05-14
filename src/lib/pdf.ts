import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type PdfChapter = { title: string; content: string };

export async function buildPdf(opts: {
  title: string;
  author: string;
  synopsis?: string;
  chapters: PdfChapter[];
}): Promise<Blob> {
  const pdf = await PDFDocument.create();
  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const PAGE_W = 432;  // 6"
  const PAGE_H = 648;  // 9"
  const MARGIN = 54;
  const LH = 16;
  const FS = 11;

  const wrap = (text: string, font: any, size: number, maxW: number) => {
    const lines: string[] = [];
    text.split(/\n/).forEach((para) => {
      const words = para.split(/\s+/);
      let line = "";
      for (const w of words) {
        const tryLine = line ? `${line} ${w}` : w;
        if (font.widthOfTextAtSize(tryLine, size) > maxW && line) {
          lines.push(line);
          line = w;
        } else {
          line = tryLine;
        }
      }
      lines.push(line);
    });
    return lines;
  };

  // Title page
  let page = pdf.addPage([PAGE_W, PAGE_H]);
  page.drawText(opts.title, { x: MARGIN, y: PAGE_H - 200, size: 28, font: serifBold, color: rgb(0.1, 0.1, 0.1) });
  page.drawText(`by ${opts.author}`, { x: MARGIN, y: PAGE_H - 230, size: 14, font: serif, color: rgb(0.3, 0.3, 0.3) });
  if (opts.synopsis) {
    wrap(opts.synopsis, serif, FS, PAGE_W - MARGIN * 2).slice(0, 12).forEach((l, i) => {
      page.drawText(l, { x: MARGIN, y: PAGE_H - 280 - i * LH, size: FS, font: serif });
    });
  }

  for (const ch of opts.chapters) {
    page = pdf.addPage([PAGE_W, PAGE_H]);
    let y = PAGE_H - MARGIN;
    page.drawText(ch.title, { x: MARGIN, y: y, size: 18, font: serifBold });
    y -= LH * 2;
    const lines = wrap(ch.content, serif, FS, PAGE_W - MARGIN * 2);
    for (const ln of lines) {
      if (y < MARGIN + LH) {
        page = pdf.addPage([PAGE_W, PAGE_H]);
        y = PAGE_H - MARGIN;
      }
      page.drawText(ln, { x: MARGIN, y, size: FS, font: serif });
      y -= LH;
    }
  }

  const bytes = await pdf.save();
  return new Blob([bytes as BlobPart], { type: "application/pdf" });
}
