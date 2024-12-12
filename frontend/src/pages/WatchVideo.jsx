import { useEffect, useState } from "react";
import { store } from "../services/localStorage";
import styled from "styled-components";
import api from "../services/api";

const WatchVideo = () => {
  const [video, setVideo] = useState();
  const [transcription, setTranscription] = useState();

  useEffect(() => {
    setVideo(store.get("video"));
    console.log(store.get("video"));
  }, []);

  function handleTranscription() {
    setTranscription("Transcrevendo...");

    async function fetchTranscription() {
      console.log(video);
      const response = await api.get(video?.transcription);
      console.log(response.data);
      setTranscription(response.data);
    }

    fetchTranscription();
  }

  return (
    <Container>
      <h1>{video?.titulo}</h1>
      <video src={video?.url} controls autoPlay />
      <p>{video?.descricao}</p>
      <button type="button" onClick={handleTranscription}>
        Transcrever
      </button>
      {transcription && <div className="transcription">{transcription}</div>}
    </Container>
  );
};

export default WatchVideo;

const Container = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: var(--background-600);
  padding: 24px;
  overflow: hidden;

  video {
    width: 100%;
  }

  div.transcription {
    background: var(--background-500);
    border-radius: 12px;
    padding: 24px;
    margin-top: 24px;
  }
`;
