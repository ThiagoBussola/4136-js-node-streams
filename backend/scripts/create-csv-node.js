const fs = require("fs");
const { Readable } = require("stream");
const { faker } = require("@faker-js/faker");

const targetSize = 2 * 1024 * 1024 * 1024; // 2GB
const outputFile = "largeFile.csv";

class CSVGenerator extends Readable {
  constructor(options) {
    super(options);
    this.bytesWritten = 0;
  }

  _read() {
    if (this.bytesWritten >= targetSize) {
      this.push(null);
      return;
    }

    const name = `${faker.person.firstName()} ${faker.person.lastName()}`;
    const seriesOrMovie = faker.helpers.arrayElement([
      "Breaking Bad",
      "Stranger Things",
      "The Godfather",
      "Game of Thrones",
      "Inception",
      "The Matrix",
      "The Dark Knight",
      "The Lord of the Rings",
      "The Hobbit",
      "The Wizard of Oz",
    ]);
    const rating = faker.number.int({ min: 1, max: 10 });

    const row = `${name},${seriesOrMovie},${rating}\n`;
    this.bytesWritten += Buffer.byteLength(row);
    this.push(row);
  }
}

console.time("CSV Generation");

const writeStream = fs.createWriteStream(outputFile);
writeStream.write("name,seriesOrMovie,rating\n");

const csvGenerator = new CSVGenerator();

csvGenerator.pipe(writeStream);

csvGenerator.on("end", () => {
  writeStream.end();
  console.timeEnd("CSV Generation");
  console.log(`File created with size: ${fs.statSync(outputFile).size} bytes`);
});
