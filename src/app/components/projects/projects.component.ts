import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommitData, Repository } from '../../models/project.model';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  imports: [CommonModule],
  // Make sure the component is standalone
  standalone: true
})

export class ProjectsComponent implements OnInit {
  recentRepositories: Repository[] = [];
  commitData: CommitData[] = [];
  
  // Calendar view data
  weeks: any[] = [];
  months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  days: string[] = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
  
  constructor() { }

  ngOnInit(): void {
    this.loadMockData();
    this.generateCalendarData();
  }

  loadMockData(): void {
    // Mock data for recent repositories
    this.recentRepositories = [
      {
        id: 1,
        name: 'angular-portfolio',
        url: 'https://github.com/username/angular-portfolio',
        lastUpdated: new Date(2025, 3, 9), // April 9, 2025
        description: 'Personal portfolio website built with Angular',
        platform: 'github'
      },
      {
        id: 2,
        name: 'data-visualization-lib',
        url: 'https://gitlab.com/username/data-visualization-lib',
        lastUpdated: new Date(2025, 3, 7), // April 7, 2025
        description: 'Library for data visualization components',
        platform: 'gitlab'
      },
      {
        id: 3,
        name: 'react-native-app',
        url: 'https://github.com/username/react-native-app',
        lastUpdated: new Date(2025, 3, 5), // April 5, 2025
        description: 'Mobile application built with React Native',
        platform: 'github'
      },
      {
        id: 4,
        name: 'api-gateway',
        url: 'https://gitlab.com/username/api-gateway',
        lastUpdated: new Date(2025, 3, 2), // April 2, 2025
        description: 'API gateway service for microservices architecture',
        platform: 'gitlab'
      },
      {
        id: 5,
        name: 'machine-learning-models',
        url: 'https://github.com/username/machine-learning-models',
        lastUpdated: new Date(2025, 2, 30), // March 30, 2025
        description: 'Collection of machine learning models and examples',
        platform: 'github'
      }
    ];

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