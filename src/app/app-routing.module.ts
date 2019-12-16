import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanAuthProvide } from './services/guard/can-auth.provide';

import { CommonLayoutComponent } from './layout/common/common-layout.component';
import { SystemLayoutComponent } from './layout/system/system-layout.component';
import { SettingLayoutComponent } from './layout/setting/setting-layout.component';

const routes: Routes = [
  // 空目录，重定向处理
  { path: '', redirectTo: '/', pathMatch: 'full' },
  {
    path: '',
    children: [{ path: '', loadChildren: './routes/login/login.module#LoginModule' }]
  },
  {
    path: '',
    component: CommonLayoutComponent,
    canActivate: [CanAuthProvide],
    children: [
      // 汽车模型
      {
        path: 'car-model',
        children: [{ path: '', loadChildren: './routes/car-model-temp/car-model.module#CarModelModule' }]
      },
      // 车型管理
      {
        path: 'car-type',
        children: [{ path: '', loadChildren: './routes/car-type/car-type.module#CarTypeModule' }]
      },
      // 文件库
      {
        path: 'file-lib',
        children: [{ path: '', loadChildren: './routes/file-lib/file-lib.module#FileLibModule' }]
      },
      // 用户信息
      {
        path: 'user-info',
        children: [{ path: '', loadChildren: './routes/user-info/user-info.module#UserInfoModule' }]
      },
      // 修改密码
      {
        path: 'update-pwd',
        children: [{ path: '', loadChildren: './routes/user-info/user-info.module#UserInfoModule' }]
      },
      // 日志查看
      // {
      //   path: 'logs',
      //   component: SystemLayoutComponent,
      //   children: [
      //     // 系统日志
      //     {
      //       path: 'system-logs',
      //       children: [{ path: '', loadChildren: './routes/logs/system-logs/system-logs.module#SystemLogsModule' }]
      //     },
      //     // 项目日志
      //     {
      //       path: 'project-logs',
      //       children: [{ path: '', loadChildren: './routes/logs/project-logs/project-logs.module#ProjectLogsModule' }]
      //     }
      //   ]
      // },
      // 系统管理
      {
        path: 'system',
        component: SystemLayoutComponent,
        children: [
          // 人员管理
          {
            path: 'personnel-manage',
            children: [{ path: '', loadChildren: './routes/system/personnel-manage/personnel-manage.module#PersonnelManageModule' }]
          },
          // 角色管理
          {
            path: 'role-manage',
            children: [{ path: '', loadChildren: './routes/system/role-manage/role-manage.module#RoleManageModule' }]
          },
          // 部门管理
          {
            path: 'department-manage',
            data: { permission: 'Pages.Administration.OrganizationUnits' },
            children: [{ path: '', loadChildren: './routes/system/department-manage/department-manage.module#DepartmentManageModule' }]
          },
          // 车型列表
          {
            path: 'cartype-list',
            children: [{ path: '', loadChildren: './routes/system/cartype-list/cartype-list.module#CarTypeListModule' }]
          },
          // 系统日志
          {
            path: 'system-logs',
            children: [{ path: '', loadChildren: './routes/system/logs/system-logs/system-logs.module#SystemLogsModule' }]
          }
        ]
      },
      // 设置
      {
        path: 'setting',
        component: SystemLayoutComponent,
        children: [
          // 树结构管理
          {
            path: 'tree-manage',
            children: [{ path: '', loadChildren: './routes/setting/tree-manage/tree-manage.module#TreeManageModule' }]
          },
          // 模型管理
          {
            path: 'model-manage',
            children: [{ path: '', loadChildren: './routes/setting/model-manage/model-manage.module#ModelManageModule' }]
          },
          // 成员列表
          {
            path: 'member-manage',
            children: [{ path: '', loadChildren: './routes/setting/member-manage/member-manage.module#MemberManageModule' }]
          },
          // 项目日志
          {
            path: 'project-logs',
            children: [{ path: '', loadChildren: './routes/setting/logs/project-logs/project-logs.module#ProjectLogsModule' }]
          }
        ]
      }
    ]
  },
  // 通配符，其他路由失败的，会跳转到这个视图
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
