import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrariansComponent } from './librarians.component';

describe('LibrariansComponent', () => {
  let component: LibrariansComponent;
  let fixture: ComponentFixture<LibrariansComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LibrariansComponent]
    });
    fixture = TestBed.createComponent(LibrariansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
