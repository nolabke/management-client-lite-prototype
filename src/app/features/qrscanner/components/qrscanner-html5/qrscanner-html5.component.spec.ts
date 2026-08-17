import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrscannerHtml5Component } from './qrscanner-html5.component';

describe('QrscannerHtml5Component', () => {
  let component: QrscannerHtml5Component;
  let fixture: ComponentFixture<QrscannerHtml5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrscannerHtml5Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrscannerHtml5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
