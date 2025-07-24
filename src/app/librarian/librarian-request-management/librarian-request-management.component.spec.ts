import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrarianRequestManagementComponent } from './librarian-request-management.component';

describe('LibrarianRequestManagementComponent', () => {
  let component: LibrarianRequestManagementComponent;
  let fixture: ComponentFixture<LibrarianRequestManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LibrarianRequestManagementComponent]
    });
    fixture = TestBed.createComponent(LibrarianRequestManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
