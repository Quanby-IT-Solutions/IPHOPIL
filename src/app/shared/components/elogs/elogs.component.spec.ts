import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElogsComponent } from './elogs.component';

describe('ElogsComponent', () => {
  let component: ElogsComponent;
  let fixture: ComponentFixture<ElogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElogsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ElogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
