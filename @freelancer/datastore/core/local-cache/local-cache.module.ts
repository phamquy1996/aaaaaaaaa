import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { LocalCacheGetEffect } from './local-cache-get.effect';
import { LocalCachePutEffect } from './local-cache-put.effect';

@NgModule({
  imports: [
    EffectsModule.forFeature([LocalCachePutEffect, LocalCacheGetEffect]),
  ],
})
export class LocalCacheModule {}
