'use client';

import { trpc } from '../lib/trpc';
import { useState } from 'react';
import styles from './search-images.module.scss';

export default function ImageSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResults, setSearchResults] = useState<any>(null);

  // Mutation para búsqueda de imágenes
  const searchImages = trpc.images.search.useMutation({
    onSuccess: (data) => {
      setSearchResults(data);
      console.log('📊 Resultados de búsqueda:', data);
    },
    onError: (error) => {
      console.error('❌ Error en búsqueda:', error);
    },
  });

  // Query para obtener estadísticas
  const { data: stats } = trpc.images.getStats.useQuery();

  const handleSearch = (page: number = 1) => {
    if (!searchQuery.trim()) {
      alert('Por favor ingresa un término de búsqueda');
      return;
    }

    setCurrentPage(page);
    searchImages.mutate({
      query: searchQuery,
      page: page,
      limit: 20,
    });
  };

  const handleNextPage = () => {
    if (searchResults?.pagination.hasNextPage) {
      handleSearch(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (searchResults?.pagination.hasPreviousPage) {
      handleSearch(currentPage - 1);
    }
  };

  return (
    <div className={styles.searchPage}>
      <div className={styles.searchPage__container}>
        {/* Header */}
        <header className={styles.searchPage__header}>
          <h1 className={styles.searchPage__title}>
            🔍 Búsqueda Vectorial de Imágenes
          </h1>
          <p className={styles.searchPage__subtitle}>
            Búsqueda semántica usando embeddings con IA
          </p>
        </header>

        {/* Estadísticas */}
        {stats && (
          <div className={styles.searchPage__stats}>
            <div className={styles.searchPage__statsItem}>
              <span className={styles.searchPage__statsLabel}>Total de Imágenes:</span>
              <span className={styles.searchPage__statsValue}>{stats.totalImages}</span>
            </div>
            <div className={styles.searchPage__statsItem}>
              <span className={styles.searchPage__statsLabel}>Con Embeddings:</span>
              <span className={styles.searchPage__statsValue}>{stats.imagesWithEmbeddings}</span>
            </div>
            <div className={styles.searchPage__statsItem}>
              <span className={styles.searchPage__statsLabel}>Sin Embeddings:</span>
              <span className={styles.searchPage__statsValue}>{stats.imagesWithoutEmbeddings}</span>
            </div>
          </div>
        )}

        {/* Barra de búsqueda */}
        <div className={styles.searchPage__searchBox}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(1)}
            placeholder="Busca por descripción, ej: 'sunset over the ocean'..."
            className={styles.searchPage__input}
            disabled={searchImages.isPending}
          />
          <button
            onClick={() => handleSearch(1)}
            className={styles.searchPage__button}
            disabled={searchImages.isPending || !searchQuery.trim()}
          >
            {searchImages.isPending ? '🔄 Buscando...' : '🔍 Buscar'}
          </button>
        </div>

        {/* Indicador de carga */}
        {searchImages.isPending && (
          <div className={styles.searchPage__loading}>
            <div className={styles.searchPage__spinner}></div>
            <p>Generando embeddings y buscando resultados...</p>
          </div>
        )}

        {/* Resultados */}
        {searchResults && !searchImages.isPending && (
          <div className={styles.searchPage__results}>
            <div className={styles.searchPage__resultsHeader}>
              <h2>
                {searchResults.pagination.totalResults} resultados para "{searchResults.query}"
              </h2>
              <p>
                Página {searchResults.pagination.currentPage} de {searchResults.pagination.totalPages}
              </p>
            </div>

            {searchResults.results.length === 0 ? (
              <div className={styles.searchPage__noResults}>
                <p>No se encontraron resultados para tu búsqueda</p>
              </div>
            ) : (
              <>
                {/* Grid de resultados */}
                <div className={styles.searchPage__grid}>
                  {searchResults.results.map((image: any, index: number) => (
                    <div key={image.id || index} className={styles.searchPage__card}>
                      <div className={styles.searchPage__imageWrapper}>
                        <img
                          src={image.imageUrl}
                          alt={'Image'}
                          className={styles.searchPage__image}
                        />
                      </div>
                      <p>{image.description}</p>
                    </div>
                  ))}
                </div>

                {/* Paginación */}
                <div className={styles.searchPage__pagination}>
                  <button
                    onClick={handlePreviousPage}
                    disabled={!searchResults.pagination.hasPreviousPage || searchImages.isPending}
                    className={styles.searchPage__paginationButton}
                  >
                    ← Anterior
                  </button>

                  <span className={styles.searchPage__paginationInfo}>
                    Página {searchResults.pagination.currentPage} de{' '}
                    {searchResults.pagination.totalPages}
                  </span>

                  <button
                    onClick={handleNextPage}
                    disabled={!searchResults.pagination.hasNextPage || searchImages.isPending}
                    className={styles.searchPage__paginationButton}
                  >
                    Siguiente →
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Información adicional */}
        <div className={styles.searchPage__info}>
          <h3>💡 Consejos de búsqueda:</h3>
          <ul>
            <li>Usa descripciones naturales: "atardecer en la playa"</li>
            <li>Funciona en múltiples idiomas</li>
            <li>Busca por conceptos, no solo palabras exactas</li>
            <li>Prueba con sinónimos y términos relacionados</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

