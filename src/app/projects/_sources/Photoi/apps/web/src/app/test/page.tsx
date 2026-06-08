'use client';

import { trpc } from '../../lib/trpc';
import { useState, useEffect } from 'react';
import styles from './test.module.scss';

export default function TestPage() {
  const [name, setName] = useState('Mundo');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [imageSearchQuery, setImageSearchQuery] = useState('');

  const { data: greeting, isLoading: greetingLoading } = trpc.example.greet.useQuery({ name });
  const { data: users, isLoading: usersLoading, refetch: refetchUsers } = trpc.example.getUsers.useQuery({ limit: 5 });
  const { data: stats, isLoading: statsLoading } = trpc.example.getStats.useQuery();
  const { data: testEnvData, isLoading: testEnvLoading } = trpc.test.getTestEnv.useQuery();
  const { data: imageStats } = trpc.images.getStats.useQuery();

  // Console log de la variable TEST_ENV cuando se obtenga
  useEffect(() => {
    if (testEnvData) {
      console.log('TEST_ENV:', testEnvData.testEnv);
      console.log('Datos completos:', testEnvData);
    }
  }, [testEnvData]);

  // Mutation para búsqueda de imágenes
  const searchImages = trpc.images.search.useMutation({
    onSuccess: (data) => {
      console.log('🔍 Búsqueda completada:', data);
      console.log(`✅ ${data.results.length} resultados encontrados`);
    },
  });

  const createUser = trpc.example.createUser.useMutation({
    onSuccess: () => {
      setNewUserName('');
      setNewUserEmail('');
      refetchUsers();
    },
  });

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserName && newUserEmail) {
      createUser.mutate({
        name: newUserName,
        email: newUserEmail,
      });
    }
  };

  return (
    <div className={styles.testPage}>
      <div className={styles.testPage__container}>
        {/* Header */}
        <header className={styles.testPage__header}>
          <h1 className={styles.testPage__headerTitle}>
            📸 Photoi Portfolio
          </h1>
          <p className={styles.testPage__headerSubtitle}>
            Demostración de tRPC con Next.js
          </p>
        </header>

        <div className={styles.testPage__grid}>
          {/* Sección de Variable de Entorno TEST_ENV */}
          <div className={styles.testPage__section}>
            <h2 className={styles.testPage__sectionTitle}>
              🔧 Variable de Entorno TEST_ENV
            </h2>
            {testEnvLoading ? (
              <div className={styles.testPage__loading}>Cargando...</div>
            ) : (
              <div className={styles.testPage__greeting}>
                <p className={styles.testPage__greetingMessage}>
                  <strong>TEST_ENV:</strong> {testEnvData?.testEnv}
                </p>
                <p className={styles.testPage__greetingMessage}>
                  <strong>NODE_ENV:</strong> {testEnvData?.nodeEnv}
                </p>
                <p className={styles.testPage__greetingTimestamp}>
                  {testEnvData?.timestamp}
                </p>
              </div>
            )}
          </div>

          {/* Sección de Saludo */}
          <div className={styles.testPage__section}>
            <h2 className={styles.testPage__sectionTitle}>
              👋 Saludo Dinámico
            </h2>
            <div className="mb-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className={styles.testPage__input}
              />
            </div>
            {greetingLoading ? (
              <div className={styles.testPage__loading}>Cargando...</div>
            ) : (
              <div className={styles.testPage__greeting}>
                <p className={styles.testPage__greetingMessage}>
                  {greeting?.message}
                </p>
                <p className={styles.testPage__greetingTimestamp}>
                  {greeting?.timestamp}
                </p>
              </div>
            )}
          </div>

          {/* Sección de Estadísticas */}
          <div className={styles.testPage__section}>
            <h2 className={styles.testPage__sectionTitle}>
              📊 Estadísticas
            </h2>
            {statsLoading ? (
              <div className={styles.testPage__loading}>Cargando estadísticas...</div>
            ) : (
              <div className={styles.testPage__stats}>
                <div className={`${styles.testPage__statsItem} ${styles.testPage__statsItemGreen}`}>
                  <p className={`${styles.testPage__statsItemLabel} ${styles.testPage__statsItemLabelGreen}`}>Usuarios Totales</p>
                  <p className={`${styles.testPage__statsItemValue} ${styles.testPage__statsItemValueGreen}`}>
                    {stats?.totalUsers}
                  </p>
                </div>
                <div className={`${styles.testPage__statsItem} ${styles.testPage__statsItemBlue}`}>
                  <p className={`${styles.testPage__statsItemLabel} ${styles.testPage__statsItemLabelBlue}`}>Usuarios Activos</p>
                  <p className={`${styles.testPage__statsItemValue} ${styles.testPage__statsItemValueBlue}`}>
                    {stats?.activeUsers}
                  </p>
                </div>
                <div className={`${styles.testPage__statsItem} ${styles.testPage__statsItemPurple}`}>
                  <p className={`${styles.testPage__statsItemLabel} ${styles.testPage__statsItemLabelPurple}`}>Fotos Totales</p>
                  <p className={`${styles.testPage__statsItemValue} ${styles.testPage__statsItemValuePurple}`}>
                    {stats?.totalPhotos}
                  </p>
                </div>
                <div className={`${styles.testPage__statsItem} ${styles.testPage__statsItemOrange}`}>
                  <p className={`${styles.testPage__statsItemLabel} ${styles.testPage__statsItemLabelOrange}`}>Almacenamiento</p>
                  <p className={`${styles.testPage__statsItemValue} ${styles.testPage__statsItemValueOrange}`}>
                    {stats?.storageUsed}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sección de Usuarios */}
          <div className={styles.testPage__section}>
            <h2 className={styles.testPage__sectionTitle}>
              👥 Lista de Usuarios
            </h2>
            {usersLoading ? (
              <div className={styles.testPage__loading}>Cargando usuarios...</div>
            ) : (
              <div className={styles.testPage__usersList}>
                {users?.users.map((user) => (
                  <div key={user.id} className={styles.testPage__usersItem}>
                    <p className={styles.testPage__usersItemName}>{user.name}</p>
                    <p className={styles.testPage__usersItemEmail}>{user.email}</p>
                    <p className={styles.testPage__usersItemDate}>
                      Creado: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sección de Crear Usuario */}
          <div className={styles.testPage__section}>
            <h2 className={styles.testPage__sectionTitle}>
              ➕ Crear Usuario
            </h2>
            <form onSubmit={handleCreateUser} className={styles.testPage__form}>
              <div className={styles.testPage__formGroup}>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Nombre del usuario"
                  className={styles.testPage__formInput}
                  required
                />
              </div>
              <div className={styles.testPage__formGroup}>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="Email del usuario"
                  className={styles.testPage__formInput}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={createUser.isPending}
                className={styles.testPage__formButton}
              >
                {createUser.isPending ? 'Creando...' : 'Crear Usuario'}
              </button>
            </form>
            {createUser.isSuccess && (
              <div className={`${styles.testPage__message} ${styles.testPage__messageSuccess}`}>
                <p>
                  ✅ {createUser.data?.message}
                </p>
              </div>
            )}
            {createUser.isError && (
              <div className={`${styles.testPage__message} ${styles.testPage__messageError}`}>
                <p>
                  ❌ Error al crear usuario
                </p>
              </div>
            )}
          </div>

          {/* Sección de Búsqueda de Imágenes */}
          <div className={styles.testPage__section}>
            <h2 className={styles.testPage__sectionTitle}>
              🖼️ Búsqueda Vectorial de Imágenes
            </h2>

            {imageStats && (
              <div className={styles.testPage__stats} style={{ marginBottom: '1rem' }}>
                <div className={`${styles.testPage__statsItem} ${styles.testPage__statsItemGreen}`}>
                  <p className={`${styles.testPage__statsItemLabel} ${styles.testPage__statsItemLabelGreen}`}>
                    Total Imágenes
                  </p>
                  <p className={`${styles.testPage__statsItemValue} ${styles.testPage__statsItemValueGreen}`}>
                    {imageStats.totalImages}
                  </p>
                </div>
                <div className={`${styles.testPage__statsItem} ${styles.testPage__statsItemBlue}`}>
                  <p className={`${styles.testPage__statsItemLabel} ${styles.testPage__statsItemLabelBlue}`}>
                    Con Embeddings
                  </p>
                  <p className={`${styles.testPage__statsItemValue} ${styles.testPage__statsItemValueBlue}`}>
                    {imageStats.imagesWithEmbeddings}
                  </p>
                </div>
              </div>
            )}

            <div className={styles.testPage__formGroup}>
              <input
                type="text"
                value={imageSearchQuery}
                onChange={(e) => setImageSearchQuery(e.target.value)}
                placeholder="Buscar imágenes (ej: 'sunset beach')"
                className={styles.testPage__formInput}
              />
            </div>

            <button
              onClick={() => {
                if (imageSearchQuery.trim()) {
                  searchImages.mutate({
                    query: imageSearchQuery,
                    page: 1,
                    limit: 20,
                  });
                }
              }}
              disabled={searchImages.isPending || !imageSearchQuery.trim()}
              className={styles.testPage__formButton}
            >
              {searchImages.isPending ? '🔄 Buscando...' : '🔍 Buscar Imágenes'}
            </button>

            {searchImages.isSuccess && (
              <div className={`${styles.testPage__message} ${styles.testPage__messageSuccess}`}>
                <p>
                  ✅ Búsqueda completada: {searchImages.data.results.length} resultados
                </p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  Revisa la consola para ver los detalles
                </p>
              </div>
            )}

            {searchImages.isError && (
              <div className={`${styles.testPage__message} ${styles.testPage__messageError}`}>
                <p>❌ Error en búsqueda (revisa la consola)</p>
              </div>
            )}

            <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
              <p>
                <strong>💡 Nota:</strong> Visita{' '}
                <a href="/search-images" style={{ color: '#667eea', fontWeight: 'bold' }}>
                  /search-images
                </a>
                {' '}para la interfaz completa
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={styles.testPage__footer}>
          <p>🚀 Desarrollado con tRPC + Next.js + TypeScript</p>
        </footer>
      </div>
    </div>
  );
}
