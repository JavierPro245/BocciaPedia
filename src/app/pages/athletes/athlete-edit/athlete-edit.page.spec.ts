import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AthleteEditPage } from './athlete-edit.page';

describe('AthleteEditPage', () => {
  let component: AthleteEditPage;
  let fixture: ComponentFixture<AthleteEditPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
