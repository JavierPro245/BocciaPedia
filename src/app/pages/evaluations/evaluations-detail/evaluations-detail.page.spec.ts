import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvaluationsDetailPage } from './evaluations-detail.page';

describe('EvaluationsDetailPage', () => {
  let component: EvaluationsDetailPage;
  let fixture: ComponentFixture<EvaluationsDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationsDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
