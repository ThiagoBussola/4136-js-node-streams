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
const audioFilePath = `${uploadDirectory}/${audioFileName}`;
function transcriptionStream() {
  const speechConfig = SpeechConfig.fromSubscription(
    subscriptionKey as string,
    serviceRegion
  );
  speechConfig.speechRecognitionLanguage = "pt-BR";
  const pushStream = AudioInputStream.createPushStream();
  const fileStream = fs.createReadStream(audioFilePath);
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
    }
  };
  speechRecognizer.startContinuousRecognitionAsync();
}
transcriptionStream();
