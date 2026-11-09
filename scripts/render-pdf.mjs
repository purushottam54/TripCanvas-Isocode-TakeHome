import puppeteer from "puppeteer-core";
import path from "path";
import fs from "fs";

async function render() {
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  console.log("Launching Edge from:", edgePath);

  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  const page = await browser.newPage();
  const htmlPath = path.resolve("docs/TDD.html");
  await page.goto(`file://${htmlPath}`, { waitUntil: "networkidle0" });

  await page.pdf({
    path: path.resolve("docs/TDD.pdf"),
    format: "A4",
    printBackground: true,
    margin: {
      top: "15mm",
      right: "15mm",
      bottom: "15mm",
      left: "15mm",
    },
  });

  await browser.close();
  console.log("Successfully generated docs/TDD.pdf via Puppeteer Core");

  try {
    fs.copyFileSync("docs/TDD.pdf", "TDD.pdf");
    console.log("Copied docs/TDD.pdf to root TDD.pdf");
  } catch (e) {
    console.warn("Could not copy to root TDD.pdf:", e.message);
  }
}

render().catch((err) => {
  console.error("PDF generation error:", err);
  process.exit(1);
});

