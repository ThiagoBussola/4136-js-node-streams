import fs from "fs";
import {
  AudioConfig,
  AudioInputStream,
  CancellationReason,
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

  fileStream.on("error", (err) => {
    console.error("Erro ao ler o arquivo:", err);
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

  speechRecognizer.canceled = (s, e) => {
    console.error(`Cancelado: Razão=${e.reason}`);
    if (e.reason === CancellationReason.Error) {
      console.log(`Cancelado: Error Code=${e.errorCode}`);
      console.log(`Cancelado: Detalhes do Erro=${e.errorDetails}`);
    }
    speechRecognizer.stopContinuousRecognitionAsync();
  };

  speechRecognizer.sessionStopped = (s, e) => {
    console.log(`Sessão interrompida: sessionId=${e.sessionId}`);
    speechRecognizer.startContinuousRecognitionAsync();
  };

  speechRecognizer.startContinuousRecognitionAsync();
}

transcriptionStream();
