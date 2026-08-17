import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteProjectDialogComponent } from './confirm-delete-project-dialog.component';

describe('ConfirmDeleteProjectDialogComponent', () => {
  let component: ConfirmDeleteProjectDialogComponent;
  let fixture: ComponentFixture<ConfirmDeleteProjectDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDeleteProjectDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmDeleteProjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
