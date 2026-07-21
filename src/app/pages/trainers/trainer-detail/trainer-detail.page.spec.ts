import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainerDetailPage } from './trainer-detail.page';

describe('TrainerDetailPage', () => {
  let component: TrainerDetailPage;
  let fixture: ComponentFixture<TrainerDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainerDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
