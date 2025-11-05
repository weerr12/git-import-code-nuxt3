import type { FileTreeItem } from "../types/github";
import { codeToHtml } from "shiki";

export interface UseFileViewerOptions {
    owner: string;
    repo: string;
    branch: string;
}

export function useFileViewer(options: UseFileViewerOptions) {
    const { owner, repo, branch } = options;

    const selectedFile = ref<FileTreeItem | null>(null);
    const fileContent = ref<string>("");
    const highlightedCode = ref<string>("");
    const loading = ref(false);
    const error = ref<string | null>(null);


    const getFileExtension = (filename: string): string => {
        const parts = filename.split(".");
        return parts.length > 1 ? parts[parts.length - 1] : "";
    };

    const getLanguageFromExtension = (filename: string): string => {
        const ext = getFileExtension(filename);
        const languageMap: Record<string, string> = {
            js: "javascript",
            jsx: "jsx",
            ts: "typescript",
            tsx: "tsx",
            vue: "vue",
            py: "python",
            java: "java",
            cpp: "cpp",
            c: "c",
            cs: "csharp",
            php: "php",
            rb: "ruby",
            go: "go",
            rs: "rust",
            swift: "swift",
            kt: "kotlin",
            json: "json",
            html: "html",
            css: "css",
            scss: "scss",
            sass: "sass",
            less: "less",
            md: "markdown",
            yaml: "yaml",
            yml: "yaml",
            xml: "xml",
            sql: "sql",
            sh: "bash",
            bash: "bash",
            zsh: "zsh",
            dockerfile: "dockerfile",
        };
        return languageMap[ext.toLowerCase()] || "plaintext";
    };

    const fetchFileContent = async (file: FileTreeItem) => {
        if (file.type !== "file") return;

        try {
            loading.value = true;
            error.value = null;
            selectedFile.value = file;
            fileContent.value = "";
            highlightedCode.value = "";

            const url = `/api/github/repos/${owner}/${repo}/contents`;
            const params = new URLSearchParams({
                ref: branch,
                path: file.path,
            });

            const response = await fetch(`${url}?${params.toString()}`);

            if (!response.ok) {
                throw new Error(`Failed to fetch file: ${response.statusText}`);
            }

            const data = await response.json();

            if (data[0]?.content) {
                const decodedContent = atob(data[0].content.replace(/\n/g, ""));
                fileContent.value = decodedContent;

                try {
                    const lang = getLanguageFromExtension(file.name);
                    highlightedCode.value = await codeToHtml(decodedContent, {
                        lang,
                        theme: "github-dark",
                    });
                } catch (highlightError) {
                    console.error("Error highlighting code:", highlightError);
                    highlightedCode.value = `<pre><code>${escapeHtml(decodedContent)}</code></pre>`;
                }
            } else {
                throw new Error("No content found in file");
            }
        } catch (err) {
            error.value = err instanceof Error ? err.message : "Failed to load file";
            console.error("Error fetching file content:", err);
            fileContent.value = "Error loading file content";
            highlightedCode.value = `<pre><code>${error.value}</code></pre>`;
        } finally {
            loading.value = false;
        }
    };

    const closeFileViewer = () => {
        selectedFile.value = null;
        fileContent.value = "";
        highlightedCode.value = "";
        error.value = null;
    };


    const escapeHtml = (text: string): string => {
        const map: Record<string, string> = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;",
        };
        return text.replace(/[&<>"']/g, (m) => map[m]);
    };

    return {
        selectedFile,
        fileContent,
        highlightedCode,
        loading,
        error,

        fetchFileContent,
        closeFileViewer,
        getLanguageFromExtension,
    };
}
