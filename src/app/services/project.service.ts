import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CommitData, Repository } from '../models/project.model';

@Injectable({
    providedIn: 'root'
  })
export class ProjectService {

private apiUrl = 'http://localhost:8080/api'; // Update with your actual backend URL

  constructor(private http: HttpClient) { }

  getRecentRepositories(limit: number = 5): Observable<Repository[]> {
    return this.http.get<any[]>(`${this.apiUrl}/repositories?limit=${limit}`).pipe(
      map(repos => repos.map(repo => ({
        id: repo.id,
        name: repo.name,
        url: repo.url,
        lastUpdated: new Date(repo.lastUpdated),
        description: repo.description || 'No description available',
        platform: repo.platform
      }))),
      catchError(error => {
        console.error('Error fetching repositories:', error);
        return throwError(() => new Error('Failed to fetch repositories. Check console for details.'));
      })
    );
  }

  getCommitData(): Observable<CommitData[]> {
    return this.http.get<any[]>(`${this.apiUrl}/commits`).pipe(
      map(commits => commits.map(commit => ({
        date: commit.date,
        count: commit.count,
        platform: commit.platform,
        repositoryId: commit.repositoryId
      }))),
      catchError(error => {
        console.error('Error fetching commit data:', error);
        return throwError(() => new Error('Failed to fetch commit data. Check console for details.'));
      })
    );
  }

  /**
   * Format date to YYYY-MM-DD
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}