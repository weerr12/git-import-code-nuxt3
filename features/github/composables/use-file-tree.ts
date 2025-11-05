import type { FileTreeItem, GitHubContent } from "../types/github";

export interface UseFileTreeOptions {
    owner: string;
    repo: string;
    branch: string;
    onFileClick?: (file: FileTreeItem) => void;
}

export function useFileTree(options: UseFileTreeOptions) {
    const { owner, repo, branch, onFileClick } = options;

    const fileStructure = ref<FileTreeItem[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const expandedFolders = ref<Set<string>>(new Set());


    const transformToTreeItem = (item: GitHubContent): FileTreeItem => ({
        ...item,
        children: [],
        expanded: false,
        loading: false,
    });

    const fetchContents = async (path?: string): Promise<GitHubContent[]> => {
        const url = `/api/github/repos/${owner}/${repo}/contents`;
        const params = new URLSearchParams({ ref: branch });

        if (path) {
            params.append("path", path);
        }

        const response = await fetch(`${url}?${params.toString()}`);

        return response.json();
    };

    const loadFileStructure = async () => {
        try {
            loading.value = true;
            error.value = null;

            const contents = await fetchContents();
            fileStructure.value = contents.map(transformToTreeItem);
        } catch (err) {
            console.error("Error fetching file structure:", err);
            fileStructure.value = [];
        } finally {
            loading.value = false;
        }
    };

    const loadFolderContents = async (folder: FileTreeItem) => {
        if (folder.type !== "dir") return;

        try {
            folder.loading = true;

            const contents = await fetchContents(folder.path);
            folder.children = contents.map(transformToTreeItem);
            folder.expanded = true;
            expandedFolders.value.add(folder.path);
        } catch (err) {
            console.error("Error fetching folder contents:", err);
        } finally {
            folder.loading = false;
        }
    };

    const toggleFolder = async (folder: FileTreeItem) => {
        if (folder.type !== "dir") return;

        if (folder.expanded) {
            folder.expanded = false;
            expandedFolders.value.delete(folder.path);
        } else {
            if (!folder.children || folder.children.length === 0) {
                await loadFolderContents(folder);
            } else {
                folder.expanded = true;
                expandedFolders.value.add(folder.path);
            }
        }
    };

    const handleItemClick = async (item: FileTreeItem) => {
        if (item.type === "dir") {
            await toggleFolder(item);
        } else if (item.type === "file" && onFileClick) {
            onFileClick(item);
        }
    };

    return {
        fileStructure,
        loading,
        error,
        expandedFolders,

        loadFileStructure,
        loadFolderContents,
        toggleFolder,
        handleItemClick,
    };
}