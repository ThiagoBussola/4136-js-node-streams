import { Request, Response, Router } from "express";
import { ensureDirectoryExists, uploadDirectory } from "../../utils/helper";
import path from "path";
import { createWriteStream } from "fs";
import { pipeline } from "stream";
import { readdir } from "fs/promises";
import { spawn } from "child_process";

const videoRouter = Router();

videoRouter.post("/upload/:fileName", (req: Request, res: Response) => {
  ensureDirectoryExists(uploadDirectory);

  const fileName = req.params.fileName;

  if (!fileName) return res.status(400).send("Nome do arquivo não informado");

  const filePath = path.join(uploadDirectory, fileName);
  const writeStream = createWriteStream(filePath);

  pipeline(req, writeStream, (err) => {
    if (err) {
      console.error("Falha na Pipeline", err);
      return res.status(500).send("Falha ao fazer Upload");
    }

    res.status(200).send(`Upload realizado com sucesso: ${fileName}`);
  });
});

videoRouter.get("/videos", async (req: Request, res: Response) => {
  ensureDirectoryExists(uploadDirectory);

  const files = await readdir(uploadDirectory);
  const videoFiles = files.filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return [".mp4", ".avi", ".mov", ".mkv"].includes(ext);
  });

  const videos = videoFiles.map((file) => ({
    url: `http://localhost:3001/video/${file}`,
    titulo: file,
    descricao: "Descrição do vídeo",
    thumbnail: "http://localhost:3001/uploads/thumbnail.png",
  }));

  console.log(videos);
  res.status(200).json(videos);
});

videoRouter.get("/video/:fileName", (req: Request, res: Response) => {
  const filePath = path.resolve(uploadDirectory, req.params.fileName);

  res.writeHead(200, { "Content-Type": "video/mp4" });

  const ffmpegProcess = spawn("ffmpeg", [
    "-i",
    filePath,
    "-vcodec",
    "libx264",
    "-acodec",
    "aac",
    "-movflags",
    "frag_keyframe+empty_moov+default_base_moof",
    "-b:v",
    "1500k",
    "-maxrate",
    "1500k",
    "-bufsize",
    "1000k",
    "-f",
    "mp4",
    "pipe:1",
  ]);

  ffmpegProcess.stderr.on("data", (data) => {
    console.error(`FFmpeg stderr: ${data}`);
  });

  ffmpegProcess.stdout.pipe(res);

  ffmpegProcess.on("close", (code) => {
    if (code === 0) return res.end();

    console.error(`O processo FFmpeg foi fechado com o código ${code}`);

    if (!res.headersSent)
      return res.status(500).send("Erro no processamento do vídeo");

    res.end();
  });

  req.on("close", () => {
    ffmpegProcess.kill("SIGKILL");
  });
});

export { videoRouter };
