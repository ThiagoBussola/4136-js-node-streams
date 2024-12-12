import fs from "fs";
import {
  AudioConfig,
  AudioInputStream,
  ResultReason,
  SpeechConfig,
  SpeechRecognizer,
} from "microsoft-cognitiveservices-speech-sdk";
import dotenv from "dotenv";
import { uploadDirectory } from "../../utils/helper";

dotenv.config();

const subscriptionKey = process.env.AZURE_WHISPER_KEY;
const serviceRegion = "brazilsouth";

const args = process.argv.slice(2);

const audioFileName = args[0];
const transcriptionFileName = args[1] || "transcription.txt";
const audioFilePath = `${uploadDirectory}/${audioFileName}`;
const transcriptionFilePath = `${uploadDirectory}/${transcriptionFileName}`;

let fullText = "";

function transcriptionStream() {
  const speechConfig = SpeechConfig.fromSubscription(
    subscriptionKey as string,
    serviceRegion
  );

  speechConfig.speechRecognitionLanguage = "pt-BR";

  const pushStream = AudioInputStream.createPushStream();

  const fileStream = fs.createReadStream(audioFilePath);
  const writeStream = fs.createWriteStream(transcriptionFilePath);

  fileStream.on("data", (chunk) => {
    console.log(`Enviando um chunk de tamanho: ${chunk.length}`);
    pushStream.write(chunk as any);
  });

  fileStream.on("end", () => {
    console.log("Fim do arquivo alcançado, fechando stream");
    pushStream.close();
  });

  const audioConfig = AudioConfig.fromStreamInput(pushStream);
  const speechRecognizer = new SpeechRecognizer(speechConfig, audioConfig);

  speechRecognizer.recognizing = (s, e) => {
    if (e.result.reason === ResultReason.RecognizingSpeech) {
      console.log(`Reconhecendo: Texto= ${e.result.text}`);
    }
  };

  speechRecognizer.recognized = (s, e) => {
    if (e.result.reason === ResultReason.RecognizedSpeech) {
      console.log(`Texto Reconhecido: ${e.result.text}`);
      fullText += e.result.text;
      writeStream.write(fullText);
    }
  };

  speechRecognizer.startContinuousRecognitionAsync();
}

transcriptionStream();
