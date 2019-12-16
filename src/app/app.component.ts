import { Component } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { IdentityUrl, FetchtokenAccount } from './config';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'check';
  public constructor(private oauthService: OAuthService) {

    // The SPA's id. Register SPA with this id at the auth-server
    this.oauthService.clientId = FetchtokenAccount.myClientId;

    // set the scope for the permissions the client should request
    // The auth-server used here only returns a refresh token (see below), when the scope offline_access is requested
    // this.oauthService.scope = "openid profile FileServer";
    this.oauthService.scope = FetchtokenAccount.myScope;

    // Use setStorage to use sessionStorage or another implementation of the TS-type Storage
    // instead of localStorage
    this.oauthService.setStorage(sessionStorage);
    this.oauthService.requireHttps = false;
    // Set a dummy secret
    // Please note that the auth-server used here demand the client to transmit a client secret, although
    // the standard explicitly cites that the password flow can also be used without it. Using a client secret
    // does not make sense for a SPA that runs in the browser. That's why the property is called dummyClientSecret
    // Using such a dummy secret is as safe as using no secret.
    this.oauthService.dummyClientSecret = FetchtokenAccount.mySecret;
    this.oauthService.issuer = IdentityUrl;
    this.oauthService.oidc = false;

    // Load Discovery Document and then try to login the user
    let url = `${IdentityUrl}/.well-known/openid-configuration`;
    this.oauthService.loadDiscoveryDocument(url).then((res) => {
      // console.log(res)
      // Do what ever you want here
    });

    this.oauthService.tokenEndpoint = `${IdentityUrl}/connect/token`;
    this.oauthService.userinfoEndpoint = `${IdentityUrl}/connect/userinfo`;
    // this.login()
  }

}
