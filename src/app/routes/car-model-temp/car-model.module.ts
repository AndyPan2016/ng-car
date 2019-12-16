import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgZorroAntdModule } from 'ng-zorro-antd';

import { CarModelComponent } from './car-model.component';
import { CustomFormsModule } from '../../components/custom-forms/custom-forms.module';
import { CustomDragModule } from '../../components/custom-drag/custom-drag.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgZorroAntdModule,
    CustomFormsModule,
    CustomDragModule,
    RouterModule.forChild([{ path: '', component: CarModelComponent }]),
  ],
  declarations: [CarModelComponent],
  providers: []
})
export class CarModelModule { }
