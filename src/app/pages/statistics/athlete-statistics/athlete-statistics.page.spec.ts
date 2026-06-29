import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AthleteStatisticsPage } from './athlete-statistics.page';

describe('AthleteStatisticsPage', () => {
  let component: AthleteStatisticsPage;
  let fixture: ComponentFixture<AthleteStatisticsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteStatisticsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
