import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UGenerateComponent } from './u-generate.component';

describe('UGenerateComponent', () => {
  let component: UGenerateComponent;
  let fixture: ComponentFixture<UGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UGenerateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
