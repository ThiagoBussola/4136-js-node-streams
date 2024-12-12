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

//brokenApp();

readLargeFile();
