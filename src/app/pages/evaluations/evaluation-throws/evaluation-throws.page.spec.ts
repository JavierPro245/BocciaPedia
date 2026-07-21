import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvaluationThrowsPage } from './evaluation-throws.page';

describe('EvaluationThrowsPage', () => {
  let component: EvaluationThrowsPage;
  let fixture: ComponentFixture<EvaluationThrowsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationThrowsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
