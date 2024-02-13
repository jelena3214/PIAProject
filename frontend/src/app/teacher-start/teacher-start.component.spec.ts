import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherStartComponent } from './teacher-start.component';

describe('TeacherStartComponent', () => {
  let component: TeacherStartComponent;
  let fixture: ComponentFixture<TeacherStartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeacherStartComponent]
    });
    fixture = TestBed.createComponent(TeacherStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
