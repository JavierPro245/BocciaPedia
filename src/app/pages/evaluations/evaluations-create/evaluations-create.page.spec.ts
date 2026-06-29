import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EvaluationsCreatePage } from './evaluations-create.page';

describe('EvaluationsCreatePage', () => {
  let component: EvaluationsCreatePage;
  let fixture: ComponentFixture<EvaluationsCreatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationsCreatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
