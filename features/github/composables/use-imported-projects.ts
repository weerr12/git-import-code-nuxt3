import type { Repository } from '../types/github'

export interface ImportedProject {
    id: string
    repository: Repository
    branch: string
    importedAt: string
}

export function useImportedProjects() {
    const loadFromStorage = () => {
        if (import.meta.client) {
            const stored = localStorage.getItem('imported-projects')
            return stored ? JSON.parse(stored) : []
        }
        return []
    }

    const projects = useState<ImportedProject[]>('imported-projects', loadFromStorage)

    if (import.meta.client) {
        const currentStored = localStorage.getItem('imported-projects')
        if (currentStored) {
            const storedProjects = JSON.parse(currentStored)
            if (storedProjects.length > projects.value.length) {
                projects.value = storedProjects
            }
        }
    }

    const addProject = (repository: Repository, branch: string) => {
        const newProject: ImportedProject = {
            id: `${repository.id}-${branch}-${Date.now()}`,
            repository,
            branch,
            importedAt: new Date().toISOString(),
        }

        const exists = projects.value.some(
            p => p.repository.id === repository.id && p.branch === branch
        )

        if (!exists) {
            projects.value = [newProject, ...projects.value]

            if (import.meta.client) {
                localStorage.setItem('imported-projects', JSON.stringify(projects.value))
            }
            return newProject.id
        } else {
            console.log('Project already exists')
            const existingProject = projects.value.find(
                p => p.repository.id === repository.id && p.branch === branch
            )
            return existingProject?.id
        }
    }

    const removeProject = (projectId: string) => {
        projects.value = projects.value.filter(p => p.id !== projectId)

        if (import.meta.client) {
            localStorage.setItem('imported-projects', JSON.stringify(projects.value))
        }
    }

    const getProjectById = (projectId: string): ImportedProject | undefined => {
        return projects.value.find(p => p.id === projectId)
    }

    return {
        projects: readonly(projects),
        addProject,
        removeProject,
        getProjectById,
    }
}
