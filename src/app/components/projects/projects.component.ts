import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommitData, Repository } from '../../models/project.model';
import { ProjectService } from '../../services/project.service';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  imports: [CommonModule],
  providers: [ProjectService],
  // Make sure the component is standalone
  standalone: true
})

export class ProjectsComponent implements OnInit {
  recentRepositories: Repository[] = [];
  commitData: CommitData[] = [];
  projectService = inject(ProjectService);
  
  // Calendar view data
  weeks: any[] = [];
  months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  days: string[] = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
  
  constructor() { }

  ngOnInit(): void {
    this.fetchRepositoryData();
    this.loadMockData();
    this.generateCalendarData();
  }

  fetchRepositoryData(): void {
    this.projectService.getRecentRepositories().subscribe(list => {
      list.forEach(item => {
        console.log(item)
        this.recentRepositories.push(item);
      })
    })
  }


  loadMockData(): void {
        // Generate mock commit data for the past year
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // Generate random commit data
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      // Some days might have no commits
      if (Math.random() > 0.3) {
        const githubCount = Math.floor(Math.random() * 8);
        this.commitData.push({
          date: this.formatDate(d),
          count: githubCount,
          platform: 'github',
          repositoryId : 1
        });
        
        // Add some gitlab commits as well
        if (Math.random() > 0.5) {
          const gitlabCount = Math.floor(Math.random() * 5);
          this.commitData.push({
            date: this.formatDate(d),
            count: gitlabCount,
            platform: 'gitlab',
            repositoryId : 2
          });
        }
      }
    }
  }

  generateCalendarData(): void {
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    oneYearAgo.setDate(oneYearAgo.getDate() - oneYearAgo.getDay());

    // Generate 53 weeks (approximately a year)
    for (let weekIndex = 0; weekIndex < 53; weekIndex++) {
      const week = [];
      for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
        const currentDate = new Date(oneYearAgo);
        currentDate.setDate(oneYearAgo.getDate() + (weekIndex * 7) + dayIndex);
        
        if (currentDate > today) {
          // Future dates are not included
          week.push({ date: null, level: 0, count: 0 });
          continue;
        }

        const dateStr = this.formatDate(currentDate);
        
        // Get combined commit counts for this date
        let githubCount = 0;
        let gitlabCount = 0;
        
        this.commitData.forEach(commit => {
          if (commit.date === dateStr) {
            if (commit.platform === 'github') {
              githubCount += commit.count;
            } else {
              gitlabCount += commit.count;
            }
          }
        });
        
        const totalCount = githubCount + gitlabCount;
        
        // Determine activity level (0-4)
        let level = 0;
        if (totalCount === 0) level = 0;
        else if (totalCount <= 2) level = 1;
        else if (totalCount <= 5) level = 2;
        else if (totalCount <= 10) level = 3;
        else level = 4;
        
        week.push({
          date: currentDate,
          level,
          count: totalCount,
          githubCount,
          gitlabCount,
          dateStr
        });
      }
      this.weeks.push(week);
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getActivityTooltip(day: any): string {
    if (!day.date) return '';
    const dateStr = this.formatDate(day.date);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${monthNames[day.date.getMonth()]} ${day.date.getDate()}, ${day.date.getFullYear()}`;
    
    if (day.count === 0) {
      return `No contributions on ${formattedDate}`;
    } else {
      return `${day.count} contributions on ${formattedDate} (GitHub: ${day.githubCount}, GitLab: ${day.gitlabCount})`;
    }
  }

  getPlatformIcon(platform: 'github' | 'gitlab'): string {
    return platform === 'github' ? 'github' : 'gitlab';
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'today';
    } else if (diffDays === 1) {
      return 'yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    }
  }
}