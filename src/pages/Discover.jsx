// frontend/src/pages/Discover.jsx
import { useEffect, useState } from "react";

const API_KEY = "5e44ab7258d398471596fe9f41cf43af";
const TMDB_BASE = "https://api.themoviedb.org/3";

function Discover() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    fetch(`${TMDB_BASE}/genre/movie/list?api_key=${API_KEY}&language=es`)
      .then(res => res.json())
      .then(data => setGenres(data.genres));
  }, []);

  useEffect(() => {
    let endpoint = `${TMDB_BASE}/movie/popular?api_key=${API_KEY}&language=es`;
    if (search.length > 1) {
      endpoint = `${TMDB_BASE}/search/movie?api_key=${API_KEY}&query=${search}`;
    } else if (selectedGenre) {
      endpoint = `${TMDB_BASE}/discover/movie?api_key=${API_KEY}&with_genres=${selectedGenre}`;
    }

    fetch(endpoint)
      .then(res => res.json())
      .then(data => setMovies(data.results || []));
  }, [search, selectedGenre]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🎬 Películas Populares</h2>

      <div className="d-flex gap-3 mb-4">
        <select
          className="form-select"
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          className="form-control"
          placeholder="Buscar película..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="row">
        {movies.map((movie) => (
          <div key={movie.id} className="col-md-3 mb-4">
            <div className="card h-100 shadow-sm">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                className="card-img-top"
                alt={movie.title}
              />
              <div className="card-body">
                <h5 className="card-title">{movie.title}</h5>
                <p className="card-text">
                  ⭐ {movie.vote_average} | {movie.release_date?.slice(0, 4)}
                </p>
              </div>
              <div className="card-footer text-end">
                <a
                  href={`https://www.themoviedb.org/movie/${movie.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary"
                >
                  Ver más
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Discover;
