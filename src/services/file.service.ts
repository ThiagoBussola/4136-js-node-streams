import { createReadStream, createWriteStream } from "fs";
import { readFile } from "fs/promises";
import { createInterface } from "readline";
import { Transform } from "stream";
import { pipeline } from "stream/promises";

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

async function processCsvFile(inputFilePath: string, outputFilePath: string) {
  try {
    const readStream = createReadStream(inputFilePath, { encoding: "utf8" });
    const writeStream = createWriteStream(outputFilePath, { encoding: "utf8" });
    const lineReader = createInterface({
      input: readStream,
    });

    const transformStream = new Transform({
      objectMode: true,
      transform(chunk: string, encoding, callback) {
        callback(null, transformCsvLine(chunk));
        //console.log(transformCsvLine(chunk));
      },
    });

    pipeline(lineReader, transformStream, writeStream);
  } catch (error) {
    console.error("Erro ao processar o CSV", error);
  }
}

//brokenApp();

//readLargeFile();

processCsvFile(filename, "output.csv");
