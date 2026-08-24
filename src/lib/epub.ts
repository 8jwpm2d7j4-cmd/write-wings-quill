import JSZip from "jszip";

const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!,
  );

export type EpubChapter = { title: string; content: string };

export async function buildEpub(opts: {
  title: string;
  author: string;
  synopsis?: string;
  chapters: EpubChapter[];
  coverDataUrl?: string;
}): Promise<Blob> {
  const zip = new JSZip();
  const id = "urn:uuid:" + crypto.randomUUID();
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });
  zip
    .folder("META-INF")!
    .file(
      "container.xml",
      `<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`,
    );

  const oebps = zip.folder("OEBPS")!;
  const css = `body{font-family:Georgia,serif;line-height:1.7;margin:1.2em}h1,h2{font-family:Georgia,serif}p{margin:0 0 1em;text-indent:1.2em}p:first-of-type{text-indent:0}`;
  oebps.file("style.css", css);

  let coverItem = "";
  let coverManifest = "";
  if (opts.coverDataUrl?.startsWith("data:image")) {
    const m = opts.coverDataUrl.match(/^data:(image\/[a-z]+);base64,(.+)$/);
    if (m) {
      const ext = m[1].split("/")[1];
      oebps.file(`cover.${ext}`, m[2], { base64: true });
      coverManifest = `<item id="cover-img" href="cover.${ext}" media-type="${m[1]}" properties="cover-image"/>`;
      coverItem = `<item id="cover" href="cover.xhtml" media-type="application/xhtml+xml"/>`;
      oebps.file(
        "cover.xhtml",
        `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title>Cover</title></head><body style="margin:0;text-align:center"><img src="cover.${ext}" alt="cover" style="max-width:100%;height:auto"/></body></html>`,
      );
    }
  }

  const chapterFiles = opts.chapters.map((c, i) => {
    const fname = `chapter${i + 1}.xhtml`;
    const body = c.content
      .split(/\n\n+/)
      .filter(Boolean)
      .map((p) => `<p>${esc(p)}</p>`)
      .join("");
    oebps.file(
      fname,
      `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title>${esc(c.title)}</title><link rel="stylesheet" type="text/css" href="style.css"/></head><body><h2>${esc(c.title)}</h2>${body}</body></html>`,
    );
    return { id: `ch${i + 1}`, fname, title: c.title };
  });

  const titlePage = `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title>${esc(opts.title)}</title><link rel="stylesheet" type="text/css" href="style.css"/></head><body><h1>${esc(opts.title)}</h1><p><em>by ${esc(opts.author)}</em></p>${opts.synopsis ? `<p>${esc(opts.synopsis)}</p>` : ""}</body></html>`;
  oebps.file("title.xhtml", titlePage);

  const manifest =
    `<item id="title" href="title.xhtml" media-type="application/xhtml+xml"/>` +
    `<item id="css" href="style.css" media-type="text/css"/>` +
    `<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>` +
    coverItem +
    coverManifest +
    chapterFiles
      .map((c) => `<item id="${c.id}" href="${c.fname}" media-type="application/xhtml+xml"/>`)
      .join("");

  const spine =
    (coverItem ? `<itemref idref="cover"/>` : "") +
    `<itemref idref="title"/>` +
    chapterFiles.map((c) => `<itemref idref="${c.id}"/>`).join("");

  oebps.file(
    "content.opf",
    `<?xml version="1.0" encoding="utf-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="bookid">${id}</dc:identifier><dc:title>${esc(opts.title)}</dc:title><dc:creator>${esc(opts.author)}</dc:creator><dc:language>en</dc:language><meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, "Z")}</meta></metadata><manifest>${manifest}</manifest><spine>${spine}</spine></package>`,
  );

  const navList = chapterFiles
    .map((c) => `<li><a href="${c.fname}">${esc(c.title)}</a></li>`)
    .join("");
  oebps.file(
    "nav.xhtml",
    `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><head><title>Contents</title></head><body><nav epub:type="toc"><h1>Contents</h1><ol>${navList}</ol></nav></body></html>`,
  );

  return zip.generateAsync({ type: "blob", mimeType: "application/epub+zip" });
}
