import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import {Utils, Status} from '../../common/helper/util-helper';

@Injectable()
export class CanAuthProvide implements CanActivate {
  constructor(
    private router: Router,
  ) { }

  public async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<any> {
    return this.can();
  }

  can() {
    let abpAuthToken = Utils.getLocalStorage(Status.abpAuthToken);
    if(abpAuthToken){
      return true;
    }
    else{
      this.router.navigate(['login']);
      return false;
    }
  }



}
