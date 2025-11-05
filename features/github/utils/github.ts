export function downloadFile(url: string, filename: string) {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function openInNewTab(url: string) {
    window.open(url, "_blank");
}

export function getGitHubZipUrl(fullName: string, branch: string): string {
    return `https://github.com/${fullName}/archive/refs/heads/${branch}.zip`;
}

export function getGitHubRepoUrl(fullName: string): string {
    return `https://github.com/${fullName}`;
}

export function parseRepoFullName(fullName: string): { owner: string; repo: string } {
    const [owner, repo] = fullName.split("/");
    return { owner, repo };
}
