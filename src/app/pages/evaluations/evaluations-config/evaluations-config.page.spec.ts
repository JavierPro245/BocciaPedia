import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvaluationsConfigPage } from './evaluations-config.page';

describe('EvaluationsConfigPage', () => {
  let component: EvaluationsConfigPage;
  let fixture: ComponentFixture<EvaluationsConfigPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationsConfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
