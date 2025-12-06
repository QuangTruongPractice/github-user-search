import { GitFork, Star, ExternalLink } from 'lucide-react';
import type { GitHubRepo } from '../types/github';

interface RepoListProps {
    repos: GitHubRepo[];
}

export const RepoList = ({ repos }: RepoListProps) => {
    if (repos.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-2xl animate-in fade-in zoom-in duration-300">
                <p className="text-gray-600 dark:text-gray-400 text-center">
                    No repositories found
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-2xl transition-colors">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Latest Repositories
            </h3>

            <div className="space-y-4">
                {repos.map((repo) => (
                    <div
                        key={repo.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-grow">
                                <a
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-600 font-semibold text-lg flex items-center gap-2 group"
                                >
                                    {repo.name}
                                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>

                                {repo.description && (
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                                        {repo.description}
                                    </p>
                                )}

                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                                    {repo.language && (
                                        <span className="flex items-center gap-1">
                                            <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                            {repo.language}
                                        </span>
                                    )}

                                    <span className="flex items-center gap-1">
                                        <Star className="w-4 h-4" />
                                        {repo.stargazers_count}
                                    </span>

                                    <span className="flex items-center gap-1">
                                        <GitFork className="w-4 h-4" />
                                        {repo.forks_count}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};