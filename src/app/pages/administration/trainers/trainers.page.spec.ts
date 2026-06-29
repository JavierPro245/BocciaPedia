import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainersPage } from './trainers.page';

describe('TrainersPage', () => {
  let component: TrainersPage;
  let fixture: ComponentFixture<TrainersPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
