import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentBorrowComponent } from './current-borrow.component';

describe('CurrentBorrowComponent', () => {
  let component: CurrentBorrowComponent;
  let fixture: ComponentFixture<CurrentBorrowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurrentBorrowComponent]
    });
    fixture = TestBed.createComponent(CurrentBorrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
