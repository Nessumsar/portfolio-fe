export interface Project {
    id: number;
    title: string;
    description: string;
    technologies: string[];
    imageUrl?: string;
    repoUrl?: string;
    liveUrl?: string;
}