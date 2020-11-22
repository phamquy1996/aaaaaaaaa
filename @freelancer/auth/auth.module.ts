import { NgModule } from '@angular/core';
import { Facebook } from '@laurentgoudet/ionic-native-facebook/ngx';
import { Keychain } from '@laurentgoudet/ionic-native-keychain/ngx';
import { SignInWithApple } from '@laurentgoudet/ionic-native-sign-in-with-apple/ngx';

@NgModule({
  providers: [Keychain, SignInWithApple, Facebook],
})
export class AuthModule {}
