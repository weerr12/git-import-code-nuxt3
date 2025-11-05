export interface Me {
    id: number
    login: string
    avatar_url: string
    name: string | null
}

export interface Repository {
    id: number
    name: string
    full_name: string
    description: string | null
    private: boolean
    updated_at: string
    default_branch: string
}

export interface Branch {
    name: string
    protected: boolean
}

export interface TreeItem {
    name: string;
    path: string;
    type: "file" | "dir";
    size: number;
    sha: string;
    children?: TreeItem[];
    expanded?: boolean;
    loading?: boolean;
}

export interface GitHubContent {
    name: string
    path: string
    type: 'file' | 'dir'
    size: number
    sha: string
    content?: string
    encoding?: string
    download_url?: string
    url?: string
    git_url?: string
    html_url?: string
}

export interface ImportState {
    repository: Repository | null
    branch: string | null
    status: 'idle' | 'importing' | 'success' | 'error'
}

export interface GitHubTokenResponse {
    access_token: string
    token_type: string
    scope: string
    error?: string
    error_description?: string
}

export interface GitHubApiError {
    message: string
    documentation_url?: string
    status?: number
}

export interface FileTreeItem extends GitHubContent {
    children?: FileTreeItem[];
    expanded?: boolean;
    loading?: boolean;
}
