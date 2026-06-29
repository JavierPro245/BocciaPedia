import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AthleteDetailPage } from './athlete-detail.page';

describe('AthleteDetailPage', () => {
  let component: AthleteDetailPage;
  let fixture: ComponentFixture<AthleteDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
