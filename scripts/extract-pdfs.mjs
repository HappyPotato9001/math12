import fs from "fs";
import path from "path";
import { PDFParse } from "pdf-parse";

const root =
  "C:\\Users\\yuiin\\.cursor\\projects\\c-Users-yuiin-Downloads-Math12\\attachments\\fa08954d-f30c-4f7d-b775-e8f447e05197";
const out = "c:\\Users\\yuiin\\Downloads\\Math12\\tmp-pdf-text";
fs.mkdirSync(out, { recursive: true });

for (const file of fs.readdirSync(root).filter((f) => f.endsWith(".pdf")).sort()) {
  const data = new Uint8Array(fs.readFileSync(path.join(root, file)));
  const parser = new PDFParse({ data });
  const result = await parser.getText();
  const text = result.text.slice(0, 25000);
  fs.writeFileSync(path.join(out, file.replace(/\.pdf$/i, ".txt")), text, "utf8");
  console.log(file, "pages", result.total || result.pages?.length || "?", "len", text.length);
  await parser.destroy?.();
}
