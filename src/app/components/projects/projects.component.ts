import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommitData, Repository } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  imports: [CommonModule],
  providers: [ProjectService]
})

export class ProjectsComponent implements OnInit {
  projectService = inject(ProjectService);
  recentRepositories: Repository[] = [];
  commitData: CommitData[] = [];
  weeks: any[] = [];
  months: string[] = [];
  days: string[] = ['', 'Mon', '', 'Wed', '', 'Fri', '', 'Sun'];

  ngOnInit(): void {
    this.fetchRepositoryData();
    this.fetchCommitData();
  }

  fetchRepositoryData(): void {
    this.projectService.getRecentRepositories().subscribe(data => {
      this.recentRepositories = data;
    });
  }

  fetchCommitData(): void {
    this.projectService.getCommitData().subscribe(data => {
      this.commitData = data;
      this.transformData(this.commitData);
    });
  }

  transformData(data: CommitData[]): void {
    const dateMap = new Map<string, CommitData[]>();

    // Group by date (YYYY-MM-DD)
    data.forEach(item => {
      const dateKey = item.date.toString();
      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, []);
      }
      dateMap.get(dateKey)!.push(item);
    });

    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);
    startDate.setDate(startDate.getDate() - startDate.getDay() +1); //To get full weeeks, back to the Sunday

    const currentDate = new Date(startDate);
    const grid: any[][] = [];

    let week: any[] = [];

    while (currentDate <= endDate) {
      const isoDate = currentDate.toISOString().split('T')[0];
      const entries = dateMap.get(isoDate) || [];
      const count = entries.reduce((sum, c) => sum + c.count, 0);
      const platformSet = new Set(entries.map(c => c.platform));

      const level = this.getHeatLevel(count);

      week.push({ date: isoDate, count, platforms: Array.from(platformSet), level });

      // Push weeks on sundays or todays date
      if (currentDate.getDay() === 0 || currentDate.toDateString() === endDate.toDateString()) {
        grid.push(week);
        week = [];
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    this.weeks = grid;
    this.setMonths();
  }

  setMonths(): void {
    let prevMonth = -1;
    this.months = this.weeks.map(week => {
      const d = new Date(week[0].date);
      const m = d.getMonth();

      if (m !== prevMonth) {
        prevMonth = m;
        return new Intl.DateTimeFormat('en-us', { month: 'short' }).format(d);
      }
      return '';
    });
  }

  getHeatLevel(count: number): number {
    if (count === 0) return 0;
    if (count < 3) return 1;
    if (count < 6) return 2;
    if (count < 10) return 3;
    return 4;
  }

  getHeatmapColor(day:any): string {
    const heatLevel = this.getHeatLevel(day.count);
    const platformText = day.platforms?.join(', ') || '';
    if (platformText.includes("github") && platformText.includes("gitlab")) {
      console.log(day)
      return "mix-"+heatLevel //Half-half-scale
    } else if (platformText.includes("github")) {
      return "gh-"+heatLevel //Green-scale
    } else if (platformText.includes("gitlab")) {
      return "gl-"+heatLevel //Orange-scale
    } else return "0" //Grey;
  }

  getActivityTooltip(day: any): string {
    const platformText = day.platforms?.join(', ') || '';
    return `${day.count} commits on ${day.date} (${platformText})`;
  }

  getPlatformIcon(platform: 'github' | 'gitlab'): string {
    return platform === 'github' ? 'github' : 'gitlab';
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week(s) ago`;
    return `${Math.floor(diffDays / 30)} month(s) ago`;
  }
}