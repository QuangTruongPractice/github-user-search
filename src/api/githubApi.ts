import axios from 'axios';
import type { GitHubUser, GitHubRepo, SearchUsersResponse } from '../types/github';

const BASE_URL = 'https://api.github.com';

export const githubApi = {
    // Lấy thông tin user
    getUserByUsername: async (username: string): Promise<GitHubUser> => {
        const response = await axios.get<GitHubUser>(`${BASE_URL}/users/${username}`);
        return response.data;
    },

    // Lấy danh sách repo của user
    getUserRepos: async (username: string): Promise<GitHubRepo[]> => {
        const response = await axios.get<GitHubRepo[]>(
            `${BASE_URL}/users/${username}/repos`,
            {
                params: {
                    sort: 'updated',
                    per_page: 5,
                },
            }
        );
        return response.data;
    },

    // Tìm kiếm user
    searchUsers: async (query: string): Promise<SearchUsersResponse> => {
        const response = await axios.get<SearchUsersResponse>(`${BASE_URL}/search/users`, {
            params: {
                q: query,
                per_page: 5,
            },
        });
        return response.data;
    },
};