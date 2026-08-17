import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BilderVerwaltungComponent } from './bilder-verwaltung.component';

describe('BilderVerwaltungComponent', () => {
  let component: BilderVerwaltungComponent;
  let fixture: ComponentFixture<BilderVerwaltungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BilderVerwaltungComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BilderVerwaltungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
