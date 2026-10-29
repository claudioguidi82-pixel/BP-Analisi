/**
 * Vector PDF Generator for Client Assessment Reports
 * Outputs standard A4 PDF files directly in the browser with embedded brand logos
 */
import { AnalysisData, TechnicalAnalysisResult } from '../types';
import { LOGO_SYSTEM_BYTE, LOGO_WINDTRE_BP, CONTACT } from '../data/assets';

// Character width tables for Helvetica and Helvetica-Bold (WinAnsi encoding)
const W: { [font: string]: number[] } = {
  r: [
    278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556,
    556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722,
    667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667,
    944, 667, 667, 611, 278, 278, 278, 469, 556, 333, 556, 556, 500, 556, 556, 278, 556, 556,
    222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500,
    334, 260, 334, 584, 761, 556, 556, 222, 556, 333, 1000, 556, 556, 333, 1000, 667, 333, 1000,
    556, 611, 556, 556, 222, 222, 333, 333, 350, 556, 1000, 333, 1000, 500, 333, 944, 556, 500,
    667, 278, 333, 556, 556, 556, 556, 260, 556, 333, 737, 370, 556, 584, 333, 737, 333, 400,
    584, 333, 333, 333, 556, 537, 278, 333, 333, 365, 556, 834, 834, 834, 611, 667, 667, 667,
    667, 667, 667, 1000, 722, 667, 667, 667, 667, 278, 278, 278, 278, 722, 722, 778, 778, 778,
    778, 778, 584, 778, 722, 722, 722, 722, 667, 667, 611, 556, 556, 556, 556, 556, 556, 889,
    500, 556, 556, 556, 556, 278, 278, 278, 278, 556, 556, 556, 556, 556, 556, 556, 584, 611,
    556, 556, 556, 556, 500, 556, 500,
  ],
  b: [
    278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556,
    556, 556, 556, 556, 556, 556, 556, 333, 333, 584, 584, 584, 611, 975, 722, 722, 722, 722,
    667, 611, 778, 722, 278, 556, 722, 611, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667,
    944, 667, 667, 611, 333, 278, 333, 584, 556, 333, 556, 611, 556, 611, 556, 333, 611, 611,
    278, 278, 556, 278, 889, 611, 611, 611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500,
    389, 280, 389, 584, 761, 556, 611, 278, 556, 500, 1000, 556, 556, 333, 1000, 667, 333, 1000,
    611, 611, 611, 611, 278, 278, 500, 500, 350, 556, 1000, 333, 1000, 556, 333, 944, 611, 500,
    667, 278, 333, 556, 556, 556, 556, 280, 556, 333, 737, 370, 556, 584, 333, 737, 333, 400,
    584, 333, 333, 333, 611, 556, 278, 333, 333, 365, 556, 834, 834, 834, 611, 722, 722, 722,
    722, 722, 722, 1000, 722, 667, 667, 667, 667, 278, 278, 278, 278, 722, 722, 778, 778, 778,
    778, 778, 584, 778, 722, 722, 722, 722, 667, 667, 611, 556, 556, 556, 556, 556, 556, 889,
    556, 556, 556, 556, 556, 278, 278, 278, 278, 611, 611, 611, 611, 611, 611, 611, 584, 611,
    611, 611, 611, 611, 556, 611, 556,
  ],
};

const CP: { [key: number]: number } = {
  8364: 128,
  8218: 130,
  402: 131,
  8222: 132,
  8230: 133,
  8224: 134,
  8225: 135,
  710: 136,
  8240: 137,
  352: 138,
  8249: 139,
  338: 140,
  381: 142,
  8216: 145,
  8217: 146,
  8220: 147,
  8221: 148,
  8226: 149,
  8211: 150,
  8212: 151,
  732: 152,
  8482: 153,
  353: 154,
  8250: 155,
  339: 156,
  382: 158,
  376: 159,
  8722: 45,
};

function enc(s: string): string {
  let o = '';
  const str = String(s);
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c >= 32 && c < 128) o += str[i];
    else if (c >= 160 && c < 256) o += String.fromCharCode(c);
    else if (CP[c]) o += String.fromCharCode(CP[c]);
    else if (c === 9) o += ' ';
    else o += '?';
  }
  return o;
}

function textWidth(s: string, font: 'r' | 'b', size: number): number {
  const e = enc(s);
  let w = 0;
  for (let i = 0; i < e.length; i++) {
    const c = e.charCodeAt(i);
    w += W[font][c - 32] || 556;
  }
  return (w * size) / 1000;
}

function escapePdf(e: string): string {
  return e.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

function wrapText(s: string, font: 'r' | 'b', size: number, max: number): string[] {
  const out: string[] = [];
  String(s)
    .split(/\r?\n|\r/)
    .forEach((par) => {
      const words = par.split(' ');
      let line = '';
      words.forEach((w) => {
        const t = line ? line + ' ' + w : w;
        if (textWidth(t, font, size) <= max || !line) {
          line = t;
        } else {
          out.push(line);
          line = w;
        }
        while (textWidth(line, font, size) > max && line.length > 1) {
          let k = line.length;
          while (k > 1 && textWidth(line.slice(0, k), font, size) > max) k--;
          out.push(line.slice(0, k));
          line = line.slice(k);
        }
      });
      out.push(line);
    });
  return out;
}

function fitText(s: string, font: 'r' | 'b', size: number, max: number): string {
  const str = String(s);
  if (textWidth(str, font, size) <= max) return str;
  let trimmed = str;
  while (trimmed.length > 1 && textWidth(trimmed + '…', font, size) > max) {
    trimmed = trimmed.slice(0, -1);
  }
  return trimmed + '…';
}

function rgb(h: string): string {
  const r = (parseInt(h.slice(1, 3), 16) / 255).toFixed(3);
  const g = (parseInt(h.slice(3, 5), 16) / 255).toFixed(3);
  const b = (parseInt(h.slice(5, 7), 16) / 255).toFixed(3);
  return `${r} ${g} ${b}`;
}

function getJpegDimensions(b: string): { w: number; h: number } | null {
  let i = 2;
  while (i < b.length) {
    if (b.charCodeAt(i) !== 0xff) return null;
    const m = b.charCodeAt(i + 1);
    const len = b.charCodeAt(i + 2) * 256 + b.charCodeAt(i + 3);
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
      return {
        h: b.charCodeAt(i + 5) * 256 + b.charCodeAt(i + 6),
        w: b.charCodeAt(i + 7) * 256 + b.charCodeAt(i + 8),
      };
    }
    i += 2 + len;
  }
  return null;
}

export function generatePdfDocument(
  data: AnalysisData,
  analysis: TechnicalAnalysisResult
): { binary: string; filename: string; blob: Blob; url: string } {
  const PW = 595.28;
  const PH = 841.89;
  const M = 42;
  const CW = PW - 2 * M;
  const FOOT = 40;

  const C = {
    ink: '#111827',
    mut: '#4b5563',
    line: '#e5e7eb',
    tint: '#f9fafb',
    or: '#fe6601',
    or2: '#ff8c2e',
    orText: '#c2410c',
    black: '#0a0a0c',
    white: '#ffffff',
  };

  const pages: string[][] = [];
  let ops: string[] = [];
  let y = 0;

  // Extract base64 image data safely
  const cleanBase64 = (uri: string) => {
    const parts = uri.split(',');
    return (parts[1] || parts[0] || '').replace(/\s+/g, '');
  };

  const imgs: { k: string; bin: string; w: number; h: number }[] = [];
  try {
    const rawSb = cleanBase64(LOGO_SYSTEM_BYTE);
    if (rawSb) {
      const binSb = atob(rawSb);
      const szSb = getJpegDimensions(binSb);
      if (szSb) imgs.push({ k: 'sb', bin: binSb, w: szSb.w, h: szSb.h });
    }
  } catch (e) {
    console.warn('System Byte logo parse skipped:', e);
  }

  try {
    const rawW3 = cleanBase64(LOGO_WINDTRE_BP);
    if (rawW3) {
      const binW3 = atob(rawW3);
      const szW3 = getJpegDimensions(binW3);
      if (szW3) imgs.push({ k: 'w3', bin: binW3, w: szW3.w, h: szW3.h });
    }
  } catch (e) {
    console.warn('WINDTRE logo parse skipped:', e);
  }

  function getImg(k: string) {
    return imgs.find((img) => img.k === k) || null;
  }

  function fill(h: string) {
    ops.push(rgb(h) + ' rg');
  }

  function rect(x: number, yy: number, w: number, h: number, col: string) {
    fill(col);
    ops.push(`${x.toFixed(2)} ${yy.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f`);
  }

  function hline(x1: number, x2: number, yy: number, col: string, wd = 0.6) {
    ops.push(`${rgb(col)} RG ${wd} w ${x1.toFixed(2)} ${yy.toFixed(2)} m ${x2.toFixed(2)} ${yy.toFixed(2)} l S`);
  }

  function text(s: string, x: number, yy: number, font: 'r' | 'b', size: number, col: string) {
    fill(col);
    ops.push(`BT /${font === 'b' ? 'F2' : 'F1'} ${size} Tf ${x.toFixed(2)} ${yy.toFixed(2)} Td (${escapePdf(enc(s))}) Tj ET`);
  }

  function textR(s: string, xr: number, yy: number, font: 'r' | 'b', size: number, col: string) {
    text(s, xr - textWidth(s, font, size), yy, font, size, col);
  }

  function drawImg(k: string, x: number, yy: number, h: number): number {
    const im = getImg(k);
    if (!im) return 0;
    const w = (im.w * h) / im.h;
    ops.push(`q ${w.toFixed(2)} 0 0 ${h.toFixed(2)} ${x.toFixed(2)} ${yy.toFixed(2)} cm /Im${k} Do Q`);
    return w;
  }

  function newPage(first: boolean) {
    ops = [];
    pages.push(ops);
    const bandH = first ? 76 : 42;
    rect(0, PH - bandH, PW, bandH, C.black);

    // Decorative orange swoosh in header
    fill(C.or);
    ops.push(
      `${PW.toFixed(2)} ${PH.toFixed(2)} m ${(PW - 30).toFixed(2)} ${PH.toFixed(2)} l ${(
        PW - 38
      ).toFixed(2)} ${(PH - bandH * 0.45).toFixed(2)} ${(PW - 62).toFixed(2)} ${(
        PH - bandH * 0.85
      ).toFixed(2)} ${(PW - 92).toFixed(2)} ${(PH - bandH).toFixed(2)} c ${PW.toFixed(
        2
      )} ${(PH - bandH).toFixed(2)} l h f`
    );
    fill(C.or2);
    ops.push(
      `${PW.toFixed(2)} ${PH.toFixed(2)} m ${(PW - 12).toFixed(2)} ${PH.toFixed(2)} l ${(
        PW - 16
      ).toFixed(2)} ${(PH - bandH * 0.5).toFixed(2)} ${(PW - 30).toFixed(2)} ${(
        PH - bandH * 0.85
      ).toFixed(2)} ${(PW - 52).toFixed(2)} ${(PH - bandH).toFixed(2)} c ${PW.toFixed(
        2
      )} ${(PH - bandH).toFixed(2)} l h f`
    );

    if (first) {
      drawImg('sb', M, PH - bandH / 2 - 15, 30);
      const w3 = getImg('w3');
      if (w3) {
        drawImg('w3', PW - 104 - (w3.w * 54) / w3.h, PH - bandH + 11, 54);
      }
    } else {
      const lw = drawImg('sb', M, PH - bandH / 2 - 9, 18);
      textR(
        fitText(data.azienda || 'Analisi Cliente', 'b', 9, PW - 110 - (M + lw + 24)),
        PW - 110,
        PH - bandH / 2 - 3.5,
        'b',
        9,
        C.white
      );
    }

    rect(0, PH - bandH - 3, PW, 3, C.or);
    y = PH - bandH - 3 - (first ? 28 : 22);
  }

  function need(h: number) {
    if (y - h < M + FOOT) {
      newPage(false);
    }
  }

  const PAGE_BODY = PH - 42 - 3 - 22 - (M + FOOT);

  // START RENDERING
  newPage(true);

  // Title Block
  const dateStr = `${new Date().toLocaleDateString('it-IT')} ${new Date().toLocaleTimeString('it-IT', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
  text('SCHEDA ANALISI ESIGENZE & PROGETTO TECNICO', M, y, 'r', 9.5, C.mut);
  textR(dateStr, PW - M, y, 'r', 9.5, C.mut);
  y -= 22;

  const clientTitle = data.azienda.trim() || 'Cliente senza ragione sociale';
  wrapText(clientTitle, 'b', 20, CW).forEach((l) => {
    text(l, M, y, 'b', 20, C.ink);
    y -= 24;
  });
  y += 4;

  const metaRows: [string, string][] = [
    ['Negozio WINDTRE', data.negozio || 'Non indicato'],
    ['Codice POS', data.pos || 'Non indicato'],
    ['Business Partner (BP)', `${data.bpNome || 'Non indicato'} ${data.bpRecapito ? `(${data.bpRecapito})` : ''}`],
  ];

  metaRows.forEach((r) => {
    const lx = M + textWidth(r[0] + ': ', 'r', 9.5);
    text(r[0] + ': ', M, y, 'r', 9.5, C.mut);
    wrapText(r[1], 'b', 9.5, PW - M - lx).forEach((l) => {
      text(l, lx, y, 'b', 9.5, C.ink);
      y -= 14;
    });
  });
  y -= 10;

  // Decision Strip: 4 Key Columns
  const decCols = analysis.decisions;
  const cw = CW / decCols.length;
  const pad = 8;
  const cells = decCols.map((d) => wrapText(d.value, 'b', 11, cw - 2 * pad));
  const maxL = Math.max(...cells.map((c) => c.length));
  const stripH = 16 + 14 + maxL * 13 + 6;

  rect(M, y - stripH, CW, stripH, C.tint);
  rect(M, y - 2, CW, 2, C.or);

  decCols.forEach((d, i) => {
    const x = M + i * cw + pad;
    let yy = y - 16;
    if (i > 0) {
      ops.push(
        `${rgb(C.line)} RG 0.8 w ${(M + i * cw).toFixed(2)} ${(y - stripH + 8).toFixed(2)} m ${(
          M +
          i * cw
        ).toFixed(2)} ${(y - 8).toFixed(2)} l S`
      );
    }
    text(d.label, x, yy, 'r', 8.5, C.mut);
    yy -= 15;
    cells[i].forEach((l) => {
      text(l, x, yy, 'b', 11, d.hot ? C.orText : C.ink);
      yy -= 13;
    });
  });
  y -= stripH + 24;

  // Sections (Questions & Answers)
  const LW = 175;
  const VX = M + LW;
  const VW = CW - LW;

  function heading(t: string) {
    need(44);
    rect(M, y - 2, 4, 13, C.or);
    text(t, M + 10, y, 'b', 12.5, C.ink);
    y -= 18;
  }

  analysis.sections.forEach((s) => {
    heading(s.title);
    s.rows.forEach((r) => {
      const lv = wrapText(r.value, 'r', 9.5, VW);
      const ll = wrapText(r.label, 'r', 9, LW - 10);
      const n = Math.max(lv.length, ll.length);
      const rowH = n * 13 + 7;

      if (rowH <= PAGE_BODY) {
        need(rowH);
        let yy = y;
        ll.forEach((l) => {
          text(l, M, yy, 'r', 9, C.mut);
          yy -= 13;
        });
        yy = y;
        lv.forEach((l) => {
          text(l, VX, yy, 'r', 9.5, C.ink);
          yy -= 13;
        });
        y -= rowH;
      } else {
        for (let j = 0; j < n; j++) {
          need(13);
          if (ll[j]) text(ll[j], M, y, 'r', 9, C.mut);
          if (lv[j]) text(lv[j], VX, y, 'r', 9.5, C.ink);
          y -= 13;
        }
        y -= 7;
      }
      hline(M, PW - M, y + 11.5, C.line, 0.5);
    });
    y -= 12;
  });

  // Project Proposed Section
  heading(analysis.projectTitle);
  text(analysis.projectSub, M + 10, y, 'r', 9, C.mut);
  y -= 20;

  analysis.project.forEach((p) => {
    const lines = wrapText(p.description, 'r', 9.5, VW);
    const rowH = Math.max(lines.length, 1) * 13 + 8;
    if (rowH <= PAGE_BODY) {
      need(rowH);
      rect(M, y - (lines.length - 1) * 13 - 3, 2, (lines.length - 1) * 13 + 10, C.or);
      text(p.category, M + 8, y, 'b', 9.5, C.ink);
      let yy = y;
      lines.forEach((l) => {
        text(l, VX, yy, 'r', 9.5, C.ink);
        yy -= 13;
      });
      y -= rowH;
    } else {
      need(13);
      text(p.category, M + 8, y, 'b', 9.5, C.ink);
      lines.forEach((l) => {
        need(13);
        rect(M, y - 3, 2, 13, C.or);
        text(l, VX, y, 'r', 9.5, C.ink);
        y -= 13;
      });
      y -= 8;
    }
  });

  y -= 8;
  const disclLines = wrapText(analysis.disclaimer, 'r', 8, CW);
  need(disclLines.length * 10 + 4);
  disclLines.forEach((l) => {
    text(l, M, y, 'r', 8, C.mut);
    y -= 10;
  });

  // Footers with page numbering
  pages.forEach((p, idx) => {
    ops = p;
    hline(M, PW - M, M + 14, C.line, 0.6);
    text(`${CONTACT.COMPANY_NAME} · ${CONTACT.EMAIL} · ${CONTACT.TEL_DISPLAY}`, M, M, 'r', 8, C.mut);
    textR(`Pagina ${idx + 1} di ${pages.length}`, PW - M, M, 'r', 8, C.mut);
  });

  // Serialize to PDF byte stream
  const objs: string[] = [];
  let out = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const offs: number[] = [];

  function addObj(s: string): number {
    objs.push(s);
    return objs.length;
  }

  const cat = addObj('');
  const pagesId = addObj('');
  const f1 = addObj(
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>'
  );
  const f2 = addObj(
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>'
  );

  let xo = '';
  imgs.forEach((im) => {
    const id = addObj(
      `<< /Type /XObject /Subtype /Image /Width ${im.w} /Height ${im.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${im.bin.length} >>\nstream\n${im.bin}\nendstream`
    );
    xo += ` /Im${im.k} ${id} 0 R`;
  });

  const res = `<< /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >> /XObject <<${xo} >> >>`;
  const kids: number[] = [];

  pages.forEach((p) => {
    const c = p.join('\n');
    const cid = addObj(`<< /Length ${c.length} >>\nstream\n${c}\nendstream`);
    kids.push(
      addObj(
        `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PW} ${PH}] /Resources ${res} /Contents ${cid} 0 R >>`
      )
    );
  });

  objs[cat - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  objs[pagesId - 1] = `<< /Type /Pages /Kids [${kids
    .map((k) => `${k} 0 R`)
    .join(' ')}] /Count ${kids.length} >>`;

  objs.forEach((o, i) => {
    offs.push(out.length);
    out += `${i + 1} 0 obj\n${o}\nendobj\n`;
  });

  const xref = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  offs.forEach((o) => {
    out += `${('000000000' + o).slice(-10)} 00000 n \n`;
  });
  out += `trailer\n<< /Size ${objs.length + 1} /Root ${cat} 0 R /Info << /Producer (System Byte - WINDTRE BP) /Title (${escapePdf(
    enc('Analisi Cliente - ' + clientTitle)
  )}) >> >>\nstartxref\n${xref}\n%%EOF`;

  // Filename format: Analisi_NomeAzienda_YYYYMMDD.pdf
  const sanitizedClient = clientTitle
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 35) || 'cliente';
  const d = new Date();
  const dateSuffix = `${d.getFullYear()}${('0' + (d.getMonth() + 1)).slice(-2)}${(
    '0' + d.getDate()
  ).slice(-2)}`;
  const filename = `Analisi_${sanitizedClient}_${dateSuffix}.pdf`;

  // Create Uint8Array Blob
  const byteArr = new Uint8Array(out.length);
  for (let i = 0; i < out.length; i++) {
    byteArr[i] = out.charCodeAt(i) & 0xff;
  }
  const blob = new Blob([byteArr], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  return { binary: out, filename, blob, url };
}

export function downloadPdf(data: AnalysisData, analysis: TechnicalAnalysisResult): void {
  const { blob, filename } = generatePdfDocument(data, analysis);
  const a = document.createElement('a');
  const tempUrl = URL.createObjectURL(blob);
  a.href = tempUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(tempUrl);
    a.remove();
  }, 2000);
}
