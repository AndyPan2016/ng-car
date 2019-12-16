import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, URLSearchParams, RequestOptions, ResponseContentType } from '@angular/http';
import { HttpClient, HttpParams, HttpHeaders, HttpEventType, HttpResponse, HttpRequest } from "@angular/common/http";

import { Utils, Status } from '../common/helper/util-helper';

import { OAuthService } from 'angular-oauth2-oidc';
import { Observable } from 'rxjs';
export enum ApiMethod {
  Get,
  Post,
  Put,
  FormData,
  Delete,
  Getblob,
  Butt
};

export interface ApiModel {
  url: string,
  method: ApiMethod
};

export interface ApiGroup {
  [apiName: string]: ApiModel
};

@Injectable()
export class RequestService {

  private token: string;
  public http: Http;
  public httpClient: HttpClient;
  public errorCodeMap: Map<string, string>;

  constructor(private injector: Injector, private router: Router) {
    this.http = injector.get(Http);
    this.httpClient = injector.get(HttpClient);
    this.errorCodeMap = new Map();
  }

  getToken(isGetSissionToken?): string {
    // this.oauthService.silentRefresh().then(info => console.debug('refresh ok', info)).catch(err => console.error('refresh error', err));
    if(isGetSissionToken){
      return 'Bearer ' + sessionStorage.getItem('access_token');
    }
    return 'Bearer ' + Utils.getLocalStorage(Status.abpAuthToken);
    // return 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImE1Y2E3ZDE3NDYyNmVlNWYzMTdjYWE0NzRkZDRhMmQ5IiwidHlwIjoiSldUIn0.eyJuYmYiOjE1NDA4MTA4OTQsImV4cCI6MTU0MDgxNDQ5NCwiaXNzIjoiaHR0cDovL3d3dy5zcGlkZXJiaW0uZGV2cCIsImF1ZCI6WyJodHRwOi8vd3d3LnNwaWRlcmJpbS5kZXZwL3Jlc291cmNlcyIsIlByb2plY3QiLCJpZGVudGl0eSIsIkZpbGVTZXJ2ZXIiLCJTcGlkZXJFbmdpbmUiLCJjaGF0YXBpIl0sImNsaWVudF9pZCI6Ind1eW9uZ3FpdSIsInN1YiI6IjVjYmYzY2ZmLTRiZTAtNGY4MS1iMjFhLTM0Y2NiYjkzZTgzMCIsImF1dGhfdGltZSI6MTU0MDc5NjY1NCwiaWRwIjoibG9jYWwiLCJjb21wYW55X2lkIjoiMGQyNmMyMjktNTk2ZC00MWExLWExYjYtYjk2MjFjNzQ2MWYxIiwiY29tcGFueV9uYW1lIjoi6YeN5bqG562R5pm65bu65bu6562R56eR5oqA5pyJ6ZmQ5YWs5Y-4IiwibmFtZSI6IuWImOW5v-a2myIsInBpY3R1cmUiOiJodHRwOi8vcHJvamVjdC5zcGlkZXJiaW0uY29tL2Fzc2V0cy9pbWFnZXMvZGVmYXVsdC9hdmF0b3IucG5nIiwicm9sZSI6WyJBZG1pbiIsIkF1ZGl0b3IiLCJPd25lciJdLCJlbWFpbCI6ImxpdWd0MzRAcXEuY29tIiwicGhvbmVfbnVtYmVyIjoiMTg2MjMzMjEyNzEiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwicGhvbmUiLCJjb21wYW55Iiwicm9sZSIsImFjY291bnQiLCJhZGRyZXNzIiwiUHJvamVjdCIsImlkZW50aXR5IiwiRmlsZVNlcnZlciIsIlNwaWRlckVuZ2luZSIsImNoYXRhcGkiXSwiYW1yIjpbInB3ZCJdfQ.nrrsNTiLV81OTx-MJWJnuORokbzk-_YJPmPK_UJVzh60e_QQ0LNM8yyXm7qACew5UlDY6Xcye4IdRWgPTctifACdKbHvE95xvOt-PKzoD1Fqd4tWLShTeFKG7W1UKuvmVbm7mx4uZrjfion73bcfnGn8uToFnBXAAXYyJwvfesqLDFxPmWiyaqBPrBAD_xzmDjoHoUqSHZCE9o_QYNNkC8A2MKaRvk8ykLkGgpQnQXNxYpa09QyAKLsfnAJCfRMx0uDk0LsBHlRBgBLn6C5bDt5nuEj8K3mRJ2EXtgPV9A9CAE3LXOydI06l3lrRRu6RaRh61KHzLwSqNZnqcoS5aQ';
  }

  // setToken(token: string) {
  //   localStorage.setItem('token', token);
  // }

  clearToken() {
    localStorage.clear();
    console.log('cls stor');
  }

  // getPers(): number[] {
  //   const perString = localStorage.getItem('pers');
  //   return JSON.parse(perString) as number[];
  // }

  // setPers(pids: number[]) {
  //   localStorage.setItem('pers', JSON.stringify(pids));
  // }

  public isQuerySuccess(res): boolean {
    return (res && res.code && (1 === res.code));
  }

  public isDotnetSuccess(res): boolean {
    return (res && res.success);
  }

  // public query(url: string, method: string, param: any, headers = {}): Promise<any> {
  //   return this.queryServer({ url: url, method: method }, param, headers);
  // }

  public run(url: string, method: ApiMethod, param: any, headers = {}): Promise<any> {
    return this.query({ url: url, method: method }, param, headers);
  }

  public query(api: ApiModel, param: any, headers = {}): Promise<any> {
    let queryApi = { url: api.url, method: 'get' };
    switch (api.method) {
      case ApiMethod.Get: queryApi.method = 'get'; break;
      case ApiMethod.Post: queryApi.method = 'post'; break;
      case ApiMethod.Put: queryApi.method = 'put'; break;
      case ApiMethod.FormData: queryApi.method = 'post-form-data'; break;
      case ApiMethod.Delete: queryApi.method = 'delete'; break;
      case ApiMethod.Getblob: queryApi.method = 'get-blob'; break;
    }
    return this.queryServer(queryApi, param, headers);
  }

  // abp项目框架新增server接口请求，添加默认header设置abp TenantId(2018年12月7日10:17:47 for AndyPan)
  public queryServerByDefaultHeader(query: { url: string, method: string }, param?: any, headers?: {}): Promise<any> {
    let defaultHeader = {
      '.AspNetCore.Culture': 'c=zh-Hans|uic=zh-Hans'
      // '.AspNetCore.Culture': 'zh-Hans'
    };
    defaultHeader[Status.abpTenantId] = Utils.getLocalStorage(Status.abpTenantId);
    for (const key in headers) {
      defaultHeader[key] = headers[key];
    }
    return this.queryServer(query, param, defaultHeader);
  }

  public queryServer(query: { url: string, method: string, catch?: any, isGetSissionToken?: any, isAuthorization?: any }, param: any, headers = {}): Promise<any> {
    let catchFn = query.catch || this.handleError;
    switch (query.method) {
      case 'post': {
        const headerOptions = new RequestOptions({ headers: this.createHeaders(headers, query.isGetSissionToken, query.isAuthorization), withCredentials: true });
        return this.http.post(query.url, param, headerOptions).toPromise()
          .then(this.checkResponeCode.bind(this)).catch(catchFn);
      }
      case 'post-form-data': {
        const headerOptions = new RequestOptions({ headers: this.createHeaders2(headers, query.isGetSissionToken, query.isAuthorization) });
        return this.http.post(query.url, param, headerOptions).toPromise()
          .then(this.checkResponeCode.bind(this)).catch(catchFn);
      }
      case 'get-blob': {
        const form = this.createRequstParam(param);
        return this.http.get(query.url, { search: form, headers: this.createHeaders(headers, query.isGetSissionToken, query.isAuthorization), responseType: ResponseContentType.Blob }).toPromise();
      }
      case 'get':
      default: {
        const form = this.createRequstParam(param);
        return this.http.get(query.url, { search: form, headers: this.createHeaders(headers, query.isGetSissionToken, query.isAuthorization) }).toPromise()
          .then(this.checkResponeCode.bind(this)).catch(catchFn);
      }
      case 'put': {
        const headerOptions = new RequestOptions({ headers: this.createHeaders(headers, query.isGetSissionToken, query.isAuthorization) });
        return this.http.put(query.url, param, headerOptions).toPromise()
          .then(this.checkResponeCode.bind(this)).catch(catchFn);
      }
      case 'delete': {
        const form = this.createRequstParam(param);
        return this.http.delete(query.url, { search: form, headers: this.createHeaders(headers, query.isGetSissionToken, query.isAuthorization) }).toPromise()
          .then(this.checkResponeCode.bind(this)).catch(catchFn);;
      }
      case 'filePut': {
        const headerOptions = new RequestOptions({ headers: this.createFileHeaders(headers) });
        return this.http.put(query.url, param, headerOptions).toPromise()
          .then(this.checkResponeCode.bind(this)).catch(catchFn);
      }
      case 'fileGet': {
        const form = this.createRequstParam(param);
        return this.http.get(query.url, { search: form, headers: this.createFileHeaders(headers)}).toPromise()
          .then(this.checkResponeCode.bind(this)).catch(catchFn);
      }
    }
  }
  public queryServer2(query: { url: string, method: string }, param: any, headers = {}): Promise<any> {
    switch (query.method) {
      case 'get':
      default: {
        const form = this.createRequstParam(param);
        return this.http.get(query.url, { search: form, headers: this.createHeaders(headers) }).toPromise();
      }
    }
  }
  public createHeaders2(headerObj, isGetSissionToken?, isAuthorization?) {
    const headers = new Headers();
    if(isAuthorization != false){
      headers.append('Authorization', this.getToken(isGetSissionToken));
    }
    for (const key in headerObj) {
      headers.append(key, headerObj[key]);
    }
    return headers;
  }

  private createRequstParam(data: { any }): any {
    const params = new URLSearchParams();
    for (const key in data) {
      params.set(key, data[key]);
    }
    return params;
  }

  private createHeaders(headerObj, isGetSissionToken?, isAuthorization?) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if(isAuthorization != false){
      headers.append('Authorization', this.getToken(isGetSissionToken));
    }
    for (const key in headerObj) {
      headers.append(key, headerObj[key]);
    }
    return headers;
  }

  private createFileHeaders(headerObj){
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + window.sessionStorage.getItem('access_token'));
    for (const key in headerObj) {
      headers.append(key, headerObj[key]);
    }
    return headers;
  }

  private checkResponeCode(res: Response) {
    const serverResponse = res.json();
    if (serverResponse.code == 1000) {
      console.log("unlogin");
      // this.router.navigate(["login"]);
    }
    return serverResponse;
  }

  private handleError(error: Response | any) {
    console.error('baseService received request error');
    console.log(error);
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body;
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      return err;
    } else {
      errMsg = error.message ? error.message : JSON.parse(error);
      return false;
    }
    // Observable.throw(error);

  }

  public get(url: string, param: any, headers = {}): Promise<any> {
    let headsCreated: HttpHeaders = this.creatHead4(headers);
    let paramCreated: HttpParams = this.creatParam4(param);
    return this.httpClient.get(url, { headers: headsCreated, params: paramCreated }).toPromise()
      .then(this.checkCode4.bind(this)).catch(this.handleError);
  }

  public request(url: string, param: any, reportProgress: boolean = false) {
    let headers = new HttpHeaders().append('Content-Type', 'application/x-www-form-urlencoded');
    let httpRequest = new HttpRequest('post', url, { headers: headers, body: param, reportProgress: reportProgress });
    return this.httpClient.request(httpRequest).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        const percentDone = Math.round(100 * event.loaded / event.total);
        console.log(`File is ${percentDone}% uploaded.`);
      } else if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
      }
    });
  }

  private creatHead4(headerObj) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', this.getToken());
    for (const key in headerObj) {
      headers = headers.set(key, headerObj[key]);
    }
    return headers;
  }

  private creatParam4(data: { any }): any {
    let params = new HttpParams();
    for (const key in data) {
      params = params.set(key, data[key]);
    }

    return params;
  }

  private checkCode4(res: any) {
    if (res.code == 1000) {
      console.log("unlogin");
    }
    return res;
  }

}
