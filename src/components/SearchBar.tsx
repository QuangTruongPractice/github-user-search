// src/components/SearchBar.tsx
import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '../hooks/useDebounce';
import { githubApi } from '../api/githubApi';

interface SearchBarProps {
    onSearch: (username: string) => void;
    isLoading?: boolean;
}

export const SearchBar = ({ onSearch, isLoading }: SearchBarProps) => {
    const [input, setInput] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    const debouncedInput = useDebounce(input, 300);

    // Fetch suggestions
    const { data: suggestionsData } = useQuery({
        queryKey: ['search-users', debouncedInput],
        queryFn: () => githubApi.searchUsers(debouncedInput),
        enabled: debouncedInput.length >= 2,
        staleTime: 60 * 1000,
    });

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onSearch(input.trim());
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (username: string) => {
        setInput(username);
        onSearch(username);
        setShowSuggestions(false);
    };

    const handlePrefetch = (username: string) => {
        // Prefetch user data and repos when hovering over a suggestion
        queryClient.prefetchQuery({
            queryKey: ['user', username],
            queryFn: () => githubApi.getUserByUsername(username),
        });
        queryClient.prefetchQuery({
            queryKey: ['repos', username],
            queryFn: () => githubApi.getUserRepos(username),
        });
    };

    const clearInput = () => {
        setInput('');
        setShowSuggestions(false);
    };

    return (
        <div ref={wrapperRef} className="w-full max-w-2xl relative z-50">
            <form onSubmit={handleSubmit} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search GitHub username..."
                    className="w-full pl-12 pr-12 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors shadow-sm"
                    disabled={isLoading}
                />

                {input && (
                    <button
                        type="button"
                        onClick={clearInput}
                        className="absolute right-24 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}

                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
                >
                    {isLoading ? '...' : 'Search'}
                </button>
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && debouncedInput.length >= 2 && suggestionsData?.items && suggestionsData.items.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <ul>
                        {suggestionsData.items.map((user) => (
                            <li key={user.id}>
                                <button
                                    onClick={() => handleSuggestionClick(user.login)}
                                    onMouseEnter={() => handlePrefetch(user.login)}
                                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
                                >
                                    <img
                                        src={user.avatar_url}
                                        alt={user.login}
                                        className="w-8 h-8 rounded-full border border-gray-200 dark:border-gray-600"
                                    />
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-gray-100">{user.login}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">ID: {user.id}</p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};