import { Injectable, Testability } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { TimeUtils } from '@freelancer/time-utils';
import { filter } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PendingTasks {
  constructor(
    private router: Router,
    private timeUtils: TimeUtils,
    private testability: Testability,
  ) {}

  monitor(): void {
    let initialNavigation = true;
    this.router.events
      .pipe(filter((event: Event) => event instanceof NavigationEnd))
      .subscribe(() => {
        let timerDone = false;
        let hasPrintedRecently = false;
        const timeoutId = this.timeUtils.setTimeout(() => {
          timerDone = true;
        }, 10_000);
        this.testability.whenStable(
          (e: any) => {
            clearTimeout(timeoutId);
            // Only log on the app is stable on the first navigation
            if (initialNavigation) {
              console.log('App is stable');
              initialNavigation = false;
            }
          },
          0,
          (pendingTasks: any) => {
            if (timerDone && !hasPrintedRecently) {
              console.warn(
                'Pending tasks blocking zone stabilization:',
                pendingTasks,
              );
              pendingTasks.forEach((task: any) => {
                if (task.data.url) {
                  console.warn(`- ${task.source}: ${task.data.url}`);
                } else if ('delay' in task.data) {
                  console.warn(`- ${task.source}: ${task.data.delay}`);
                } else {
                  console.warn(
                    `- ${task.source}: ${task.creationLocation.stack}`,
                  );
                }
              });
              // Update the remaining tasks list every 1 second not to flood
              // the console
              hasPrintedRecently = true;
              this.timeUtils.setTimeout(() => {
                hasPrintedRecently = false;
              }, 1_000);
            }
          },
        );
      });
  }
}
