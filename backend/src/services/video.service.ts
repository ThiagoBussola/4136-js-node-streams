import { Request, Response, Router } from "express";
import { ensureDirectoryExists, uploadDirectory } from "../../utils/helper";
import path from "path";
import { createWriteStream } from "fs";
import { pipeline } from "stream";
import { readdir } from "fs/promises";

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

export { videoRouter };
