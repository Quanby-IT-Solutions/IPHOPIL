import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarServiceService {
  private isCollapsedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isCollapsed$: Observable<boolean> = this.isCollapsedSubject.asObservable();

  /**
   * constructor here is removed for avoid the lintingerror because it is unused and empty,
   * if you want to keep the constructor then you can add the following code in the constructor
   *
   * ERROR: Unexpected empty constructor  @typescript-eslint/no-empty-function
   */

  toggleSidebar(): void {
    this.isCollapsedSubject.next(!this.isCollapsedSubject.value);
  }

  getIsCollapsed(): boolean {
    return this.isCollapsedSubject.value;
  }

  setCollapsed(isCollapsed: boolean): void {
    this.isCollapsedSubject.next(isCollapsed);
  }
}
