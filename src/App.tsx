// src/App.tsx
import { useState, useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { Github, AlertCircle } from 'lucide-react';
import { useThemeStore } from './store/themeStore';
import { githubApi } from './api/githubApi';
import { SearchBar } from './components/SearchBar';
import { UserCard } from './components/UserCard';
import { RepoList } from './components/RepoList';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  const [username, setUsername] = useState('');
  const { isDark } = useThemeStore();

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Query user data
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ['user', username],
    queryFn: () => githubApi.getUserByUsername(username),
    enabled: !!username,
    retry: false,
    placeholderData: keepPreviousData,
  });

  // Query repos data
  const {
    data: repos,
    isLoading: isLoadingRepos,
  } = useQuery({
    queryKey: ['repos', username],
    queryFn: () => githubApi.getUserRepos(username),
    enabled: !!username,
    retry: false,
    placeholderData: keepPreviousData,
  });

  const handleSearch = (searchUsername: string) => {
    setUsername(searchUsername);
  };

  const isLoading = isLoadingUser || isLoadingRepos;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="w-8 h-8 text-gray-900 dark:text-gray-100" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              GitHub User Search
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-8">
          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />

          {/* Loading State */}
          {isLoading && (
            <div className="text-gray-600 dark:text-gray-400">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          )}

          {/* Error State */}
          {userError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3 max-w-2xl w-full">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700 dark:text-red-400">
                User not found. Please try another username.
              </p>
            </div>
          )}

          {/* User Data */}
          {user && !isLoading && (
            <>
              <UserCard user={user} />
              {repos && <RepoList repos={repos} />}
            </>
          )}

          {/* Empty State */}
          {!username && !isLoading && (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
              <Github className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Search for a GitHub user to get started</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;