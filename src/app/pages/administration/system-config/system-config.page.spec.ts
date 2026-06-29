import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemConfigPage } from './system-config.page';

describe('SystemConfigPage', () => {
  let component: SystemConfigPage;
  let fixture: ComponentFixture<SystemConfigPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemConfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
