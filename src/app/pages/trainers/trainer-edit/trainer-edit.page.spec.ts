import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainerEditPage } from './trainer-edit.page';

describe('TrainerEditPage', () => {
  let component: TrainerEditPage;
  let fixture: ComponentFixture<TrainerEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainerEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
