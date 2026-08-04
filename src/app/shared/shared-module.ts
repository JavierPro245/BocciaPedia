import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { LoginInputComponent } from './components/login-input/login-input.component';
import { LogoComponent } from './components/logo/logo.component';
import { UpdateAthleteComponent } from './components/update-athlete/update-athlete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomButtonComponent } from './components/custom-button/custom-button.component';
import { ProfileAvatarComponent } from './components/profile-avatar/profile-avatar.component';
import { LoadingComponent } from './components/loading/loading.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ImagePickerComponent } from './components/image-picker/image-picker.component';
import { DashboardCardComponent } from './components/dashboard-card/dashboard-card.component';
import { RouterModule } from '@angular/router';
import { SettingsItemComponent } from './components/settings-item/settings-item.component';
import { AthleteCardComponent } from './components/athlete-card/athlete-card.component';
import { ActionMenuComponent } from './components/action-menu/action-menu.component';
import { FormSectionComponent } from './components/form-section/form-section.component';
import { SelectInputComponent } from './components/select-input/select-input.component';
import { CourtComponent } from './components/court/court.component';
import { ThrowResultModalComponent } from './components/throw-result-modal/throw-result-modal.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { CountdownCircleComponent } from './components/countdown-circle/countdown-circle.component';
import { TrainerCardComponent } from './components/trainer-card/trainer-card.component';
import { UserInfoCardComponent } from './components/user-info-card/user-info-card.component';
import { HasRoleDirective } from '../directives/has-role.directive';
import { QualityChartComponent } from './components/charts/quality-chart/quality-chart.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { RoleChipComponent } from './components/role-chip/role-chip.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';



@NgModule({
  declarations: [
    HeaderComponent,
    LoginInputComponent,
    LogoComponent,
    UpdateAthleteComponent,
    CustomButtonComponent,
    ProfileAvatarComponent,
    LoadingComponent,
    EmptyStateComponent,
    ConfirmDialogComponent,
    ImagePickerComponent,
    DashboardCardComponent,
    SettingsItemComponent,
    AthleteCardComponent,
    ActionMenuComponent,
    FormSectionComponent,
    SelectInputComponent,
    CourtComponent,
    ThrowResultModalComponent,
    ConfirmationModalComponent,
    CountdownCircleComponent,
    TrainerCardComponent,
    UserInfoCardComponent,
    HasRoleDirective,
    QualityChartComponent,
    RoleChipComponent,
    UserAvatarComponent,
  ],
  exports: [
    HeaderComponent,
    LoginInputComponent,
    LogoComponent,
    UpdateAthleteComponent,
    CustomButtonComponent,
    ProfileAvatarComponent,
    LoadingComponent,
    EmptyStateComponent,
    ConfirmDialogComponent,
    ImagePickerComponent,
    DashboardCardComponent,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SettingsItemComponent,
    AthleteCardComponent,
    ActionMenuComponent,
    FormSectionComponent,
    SelectInputComponent,
    CourtComponent,
    ThrowResultModalComponent,
    ConfirmationModalComponent,
    CountdownCircleComponent,
    TrainerCardComponent,
    UserInfoCardComponent,
    HasRoleDirective,
    QualityChartComponent,
    RoleChipComponent,
    UserAvatarComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule,
    NgApexchartsModule
  ]
})
export class SharedModule { }
