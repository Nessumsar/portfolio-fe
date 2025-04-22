import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CommitData, Repository } from '../models/project.model';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
  })
export class ProjectService {
  private api = inject(ApiService);

  getRecentRepositories(): Observable<Repository[]> {
    return this.api.get('repository').pipe(
      map(repos => repos.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        url: repo.htmlUrl,
        lastUpdated: new Date(repo.lastUpdated),
        description: repo.description || 'No description available',
        platform: repo.platform.toLowerCase()
      }))),
      catchError(error => {
        console.error('Error fetching repositories:', error);
        return throwError(() => new Error('Failed to fetch repositories. Check console for details.'));
      })
    );
  }

  getCommitData(): Observable<CommitData[]> {
    return this.api.get('commit').pipe(
      map(commits => commits.map((commit: any) => ({
        date: commit.date,
        count: commit.count,
        platform: commit.platform.toLowerCase(),
        repositoryId: commit.repositoryId
      }))),
      catchError(error => {
        console.error('Error fetching commit data:', error);
        return throwError(() => new Error('Failed to fetch commit data. Check console for details.'));
      })
    );
  }
}