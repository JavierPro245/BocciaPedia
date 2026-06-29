import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComparisionsPage } from './comparisions.page';

describe('ComparisionsPage', () => {
  let component: ComparisionsPage;
  let fixture: ComponentFixture<ComparisionsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparisionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
