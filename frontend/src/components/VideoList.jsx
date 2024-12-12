import { useEffect, useState } from "react";
import styled from "styled-components";
import api, { endpoints } from "../services/api";
import { Link } from "react-router-dom";
import { store } from "../services/localStorage";

const VideoList = () => {
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredVideos, setFilteredVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await api.get(endpoints.videos);
        console.log(response.data);
        setVideos(response.data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    setFilteredVideos(
      videos.filter((video) =>
        video.titulo.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, videos]);

  if (loading) {
    return (
      <Container>
        <h1>Carregando...</h1>
      </Container>
    );
  }

  if (!filteredVideos.length) {
    return (
      <Container>
        <h1>Nenhum filme encontrado</h1>
      </Container>
    );
  }

  return (
    <Container>
      <nav>
        <h1>
          {filteredVideos.length} Filme{filteredVideos.length > 1 ? "s" : ""}{" "}
          encontrado{filteredVideos.length > 1 ? "s" : ""}
        </h1>
        <input
          type="search"
          placeholder="Pesquisar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </nav>

      <ul>
        {filteredVideos.map((video) => (
          <Link
            key={video.titulo}
            to={`/video/${video.titulo}`}
            onClick={() => store.set("video", video)}
          >
            <li>
              <img src={video.thumbnail} alt={video.titulo} />
              <h2>{video.titulo}</h2>
              <p>{video.descricao}</p>
            </li>
          </Link>
        ))}
      </ul>
    </Container>
  );
};

export default VideoList;

const Container = styled.nav`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > nav {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    input[type="search"] {
      width: 300px;
      height: 40px;
      border-radius: 12px;
      border: 1px solid var(--text-secondary);
      color: var(--text-primary);
      padding: 24px 16px;

      &::placeholder {
        color: var(--text-secondary);
      }

      &:focus {
        border-color: var(--primary);
      }
    }
  }

  > ul {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    list-style: none;
    gap: 16px;
    padding: 0;

    a {
      text-decoration: none;
      color: var(--text-primary);
    }

    li {
      cursor: pointer;
      background-color: var(--background-500);
      padding: 16px;
      border-radius: 8px;
      width: 400px;
      height: 100%;

      transition: all 0.3s ease;

      &:hover {
        scale: 1.05;
      }

      img {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }
    }
  }
`;
