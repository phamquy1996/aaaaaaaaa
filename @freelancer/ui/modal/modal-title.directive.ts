import {
  Directive,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { ModalService } from './modal.service';

@Directive({ selector: '[flModalTitle]' })
export class ModalTitleDirective implements OnInit, OnDestroy {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private modalService: ModalService,
  ) {}

  ngOnInit() {
    this.viewContainerRef.clear();
    this.modalService.setTitleTemplate(this.templateRef);
  }

  ngOnDestroy() {
    this.modalService.setTitleTemplate(undefined);
  }
}
