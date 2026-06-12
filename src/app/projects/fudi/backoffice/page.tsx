'use client';

import { trpc } from '../../lib/trpc';
import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('Mundo');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');

  // Queries
  const { data: greeting, isLoading: greetingLoading } = trpc.example.greet.useQuery({ name });
  const { data: users, isLoading: usersLoading, refetch: refetchUsers } = trpc.example.getUsers.useQuery({ limit: 5 });
  const { data: stats, isLoading: statsLoading } = trpc.example.getStats.useQuery();

  // Mutations
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            📸 Photoi Portfolio
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Demostración de tRPC con Next.js
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sección de Saludo */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              👋 Saludo Dinámico
            </h2>
            <div className="mb-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            {greetingLoading ? (
              <div className="text-gray-500">Cargando...</div>
            ) : (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                <p className="text-blue-800 dark:text-blue-200 font-medium">
                  {greeting?.message}
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                  {greeting?.timestamp}
                </p>
              </div>
            )}
          </div>

          {/* Sección de Estadísticas */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              📊 Estadísticas
            </h2>
            {statsLoading ? (
              <div className="text-gray-500">Cargando estadísticas...</div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                  <p className="text-sm text-green-600 dark:text-green-400">Usuarios Totales</p>
                  <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                    {stats?.totalUsers}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md">
                  <p className="text-sm text-blue-600 dark:text-blue-400">Usuarios Activos</p>
                  <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                    {stats?.activeUsers}
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-md">
                  <p className="text-sm text-purple-600 dark:text-purple-400">Fotos Totales</p>
                  <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                    {stats?.totalPhotos}
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-md">
                  <p className="text-sm text-orange-600 dark:text-orange-400">Almacenamiento</p>
                  <p className="text-2xl font-bold text-orange-800 dark:text-orange-200">
                    {stats?.storageUsed}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sección de Usuarios */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              👥 Lista de Usuarios
            </h2>
            {usersLoading ? (
              <div className="text-gray-500">Cargando usuarios...</div>
            ) : (
              <div className="space-y-3">
                {users?.users.map((user) => (
                  <div key={user.id} className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                    <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Creado: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sección de Crear Usuario */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              ➕ Crear Usuario
            </h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Nombre del usuario"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="Email del usuario"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={createUser.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                {createUser.isPending ? 'Creando...' : 'Crear Usuario'}
              </button>
            </form>
            {createUser.isSuccess && (
              <div className="mt-4 bg-green-50 dark:bg-green-900/20 p-3 rounded-md">
                <p className="text-green-800 dark:text-green-200">
                  ✅ {createUser.data?.message}
                </p>
              </div>
            )}
            {createUser.isError && (
              <div className="mt-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                <p className="text-red-800 dark:text-red-200">
                  ❌ Error al crear usuario
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-600 dark:text-gray-400">
          <p>🚀 Desarrollado con tRPC + Next.js + TypeScript</p>
        </footer>
      </div>
    </div>
  );
}
