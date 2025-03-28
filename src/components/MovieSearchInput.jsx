// 📁 frontend/src/components/MovieSearchInput.jsx
import { useState } from "react";

const API_KEY = "5e44ab7258d398471596fe9f41cf43af";

function MovieSearchInput({ onMovieSelect }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.length < 2) return;

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${val}`
      );
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error("Error buscando películas:", err);
    }
  };

  return (
    <div>
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Buscar película..."
        value={query}
        onChange={handleSearch}
      />
      {results.length > 0 && (
        <ul className="list-group">
          {results.slice(0, 5).map((movie) => (
            <li
              key={movie.id}
              className="list-group-item list-group-item-action"
              onClick={() => {
                onMovieSelect(movie);
                setQuery(movie.title);
                setResults([]);
              }}
            >
              🎬 {movie.title} ({movie.release_date?.slice(0, 4)})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MovieSearchInput;
