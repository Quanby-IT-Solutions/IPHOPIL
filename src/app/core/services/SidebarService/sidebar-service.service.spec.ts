import { TestBed } from '@angular/core/testing';
import { SidebarServiceService } from './sidebar-service.service';
import { assert } from 'chai';

describe('SidebarServiceService', () => {
  let service: SidebarServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SidebarServiceService]
    });
    service = TestBed.inject(SidebarServiceService);
  });

  it('should create the service instance', () => {
    assert.exists(service);
  });

  it('should toggle sidebar state', () => {
    // Initially false
    assert.strictEqual(service.getIsCollapsed(), false);

    // Toggle to true
    service.toggleSidebar();
    assert.strictEqual(service.getIsCollapsed(), true);

    // Toggle back to false
    service.toggleSidebar();
    assert.strictEqual(service.getIsCollapsed(), false);
  });

  it('should set collapsed state', () => {
    service.setCollapsed(true);
    assert.strictEqual(service.getIsCollapsed(), true);
  });

  // Additional test for the Observable
  it('should emit collapsed state changes', (done) => {
    service.isCollapsed$.subscribe(state => {
      assert.strictEqual(state, true);
      done();
    });

    service.setCollapsed(true);
  });
});
