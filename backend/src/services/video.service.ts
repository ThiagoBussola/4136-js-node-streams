import { Request, Response, Router } from "express";
import { ensureDirectoryExists, uploadDirectory } from "../../utils/helper";
import path from "path";
import { createWriteStream } from "fs";
import { pipeline } from "stream";

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

export { videoRouter };
