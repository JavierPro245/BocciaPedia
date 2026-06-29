import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AthleteCreatePage } from './athlete-create.page';

describe('AthleteCreatePage', () => {
  let component: AthleteCreatePage;
  let fixture: ComponentFixture<AthleteCreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AthleteCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
