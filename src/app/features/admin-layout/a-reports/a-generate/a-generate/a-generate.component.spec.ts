import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AGenerateComponent } from './a-generate.component';

describe('AGenerateComponent', () => {
  let component: AGenerateComponent;
  let fixture: ComponentFixture<AGenerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AGenerateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
