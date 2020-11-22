import { NgModule } from '@angular/core';
import { AndroidPermissions } from '@laurentgoudet/ionic-native-android-permissions/ngx';
import { FileTransfer } from '@laurentgoudet/ionic-native-file-transfer/ngx';
import { File } from '@laurentgoudet/ionic-native-file/ngx';

// FIXME: https://github.com/ionic-team/ionic-native/issues/3091
// Ionic native providers should use providedIn: 'root' in the first place
@NgModule({
  providers: [AndroidPermissions, File, FileTransfer],
})
export class FileDownloadModule {}
