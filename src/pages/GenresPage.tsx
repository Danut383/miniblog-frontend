import React, { useEffect } from 'react';
import GenreList from '../components/movies/GenreList';

const GenresPage: React.FC = () => {
  useEffect(() => {
    document.title = 'Géneros de Películas | CinemaBlog';
  }, []);

  return (
    <main className="pt-24 pb-12">
      <div className="container-custom mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">Géneros de Películas</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explora películas por tu género favorito. Haz clic en cualquier género para ver las películas relacionadas.
          </p>
        </div>
        
        <GenreList />
      </div>
    </main>
  );
};

export default GenresPage;