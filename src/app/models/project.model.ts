export interface Repository {
    id: number;
    name: string;
    url: string;
    lastUpdated: Date;
    description: string;
    platform: 'github' | 'gitlab';
}

export interface CommitData {
    date: Date;
    count: number;
    platform: 'github' | 'gitlab';
    repositoryId: number;
}