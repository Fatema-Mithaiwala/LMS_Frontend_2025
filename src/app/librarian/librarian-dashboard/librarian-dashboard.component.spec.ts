import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrarianDashboardComponent } from './librarian-dashboard.component';

describe('LibrarianDashboardComponent', () => {
  let component: LibrarianDashboardComponent;
  let fixture: ComponentFixture<LibrarianDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LibrarianDashboardComponent]
    });
    fixture = TestBed.createComponent(LibrarianDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
