import { createReadStream } from "fs";
import { readFile } from "fs/promises";

const filename = "largeFile.csv";

async function brokenApp() {
  await readFile(filename, "utf8");
}

function readLargeFile() {
  const readStream = createReadStream(filename, { encoding: "utf8" });

  readStream.on("data", (chunk) => {
    console.log(chunk);
  });
}

function transformCsvLine(line: string) {
  const parts = line.split(",");
  if (parts.length === 3) {
    parts[0] = parts[0].trim().toUpperCase();
    const alterationDate = new Date().toISOString();
    return [...parts, alterationDate].join(",") + "\n";
  }
  return line + "\n";
}

//brokenApp();

//readLargeFile();
