// src/components/UserCard.tsx
import { Users, BookOpen, ExternalLink } from 'lucide-react';
import type { GitHubUser } from '../types/github';

interface UserCardProps {
    user: GitHubUser;
}

export const UserCard = ({ user }: UserCardProps) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-2xl transition-colors">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <img
                        src={user.avatar_url}
                        alt={user.login}
                        className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-md"
                    />
                </div>

                {/* User Info */}
                <div className="flex-grow text-center md:text-left w-full">
                    <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-2 mb-2">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            {user.name || user.login}
                        </h2>
                        <a
                            href={user.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                        >
                            <span className="text-sm font-medium">View Profile</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">@{user.login}</p>

                    {user.bio && (
                        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                            {user.bio}
                        </p>
                    )}

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                            <Users className="w-5 h-5 text-blue-500" />
                            <span className="text-gray-700 dark:text-gray-300">
                                <strong className="text-gray-900 dark:text-white">{user.followers}</strong> followers
                            </span>
                        </div>

                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                            <Users className="w-5 h-5 text-purple-500" />
                            <span className="text-gray-700 dark:text-gray-300">
                                <strong className="text-gray-900 dark:text-white">{user.following}</strong> following
                            </span>
                        </div>

                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                            <BookOpen className="w-5 h-5 text-green-500" />
                            <span className="text-gray-700 dark:text-gray-300">
                                <strong className="text-gray-900 dark:text-white">{user.public_repos}</strong> repos
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};