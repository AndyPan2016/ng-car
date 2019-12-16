import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, zh_CN, NZ_MESSAGE_CONFIG } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { HttpModule } from '@angular/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { ProgressHttpModule } from "angular-progress-http";

import { AppRoutingModule } from './app-routing.module';
import { RequestService } from './services/request.service';
import { CustomFormsModule } from './components/custom-forms/custom-forms.module';
import { CommonLayoutComponent } from './layout/common/common-layout.component';
import { SystemLayoutComponent } from './layout/system/system-layout.component';
import { SettingLayoutComponent } from './layout/setting/setting-layout.component';
import { CanAuthProvide } from './services/guard/can-auth.provide';
import { BasicAuthInterceptor } from './services/guard/basicAuth.interceptor';
import { QRCodeModule } from 'angularx-qrcode';

// import { CarModelService } from './services/car-model/car-model.service';
// import { CarTypeService } from './services/car-type/car-type.service';
// import { FileLibService } from './services/file-lib/file-lib.service';
// import { LoginService } from './services/login/login.server';
// import { MemberManageService } from './services/setting/member-manage.service';
// import { TreeManageService } from './services/setting/tree-manage.service';
// import { CarTypeManageService } from './services/system/cartype-manage.service';
// import { DepartmentManageService } from './services/system/department-manage.service';
// import { PersonnelManageService } from './services/system/personnel-manage.service';
// import { RoleManageService } from './services/system/role-manage.service';
// import { UserInfoService } from './services/user-info/user-info.service';


registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    CommonLayoutComponent,
    SystemLayoutComponent,
    SettingLayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    NgZorroAntdModule.forRoot(),
    AppRoutingModule,
    ProgressHttpModule,
    CustomFormsModule,
    OAuthModule.forRoot(),
    QRCodeModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    RequestService,
    CanAuthProvide,
    // CarModelService, CarTypeService, FileLibService, LoginService, MemberManageService, TreeManageService,
    // CarTypeManageService, DepartmentManageService, PersonnelManageService,RoleManageService, UserInfoService,
    { provide: NZ_MESSAGE_CONFIG, useValue: { nzDuration: 4000 }},
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
