import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { ToastAlertContainerComponent } from './toast-alert-container.component';
import { ToastAlertComponent } from './toast-alert.component';

@Injectable({ providedIn: 'root' })
export class ToastAlertService {
  private toastAlerts: { [k: string]: ToastAlertComponent } = {};
  private activeToasts: ToastAlertComponent[] = [];
  private containers: ToastAlertContainerComponent[] = [];
  private renderer: Renderer2;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  add(toastAlertItem: ToastAlertComponent, id: string) {
    this.toastAlerts = { ...this.toastAlerts, ...{ [id]: toastAlertItem } };
  }

  remove(id: string) {
    delete this.toastAlerts[id];
  }

  registerContainer(toastAlertContainer: ToastAlertContainerComponent) {
    this.containers = [...this.containers, toastAlertContainer];
  }

  unregisterContainer(toastAlertContainer: ToastAlertContainerComponent) {
    this.containers = this.containers.filter(
      item => item !== toastAlertContainer,
    );
  }

  open(id: string) {
    const toastAlertItem = this.toastAlerts[id];

    if (typeof toastAlertItem === 'undefined') {
      return;
    }

    if (this.activeToasts.includes(toastAlertItem)) {
      toastAlertItem.resetTimer();
    } else {
      this.containers.forEach(item => {
        if (item.isElementVisible()) {
          this.renderer.appendChild(
            item.container.nativeElement,
            toastAlertItem.element,
          );
        }
      });

      this.renderer.addClass(toastAlertItem.element, 'IsActive');
      toastAlertItem.toggleVisibility('visible');
      toastAlertItem.startTimer();
      this.addToActiveToasts(toastAlertItem);
    }
  }

  close(id: string) {
    const toastAlertItem = this.toastAlerts[id];

    if (typeof toastAlertItem === 'undefined') {
      return;
    }
    toastAlertItem.toggleVisibility('hidden');
    this.activeToasts = this.activeToasts.filter(x => x.id !== id);
    this.repositionItems();
  }

  addToActiveToasts(item: ToastAlertComponent) {
    this.activeToasts = [...this.activeToasts, item];
    this.repositionItems();
  }

  removeElement(id: string) {
    const toastAlertItem = this.toastAlerts[id];

    if (toastAlertItem) {
      this.containers.forEach(item => {
        if (item.isElementVisible()) {
          this.renderer.removeChild(
            item.container.nativeElement,
            toastAlertItem.element,
          );
        }
      });
    }
  }

  private repositionItems() {
    const offset = 8;
    let position = offset;

    this.activeToasts.forEach(item => {
      item.move(position);
      position += item.element.offsetHeight + offset;
    });
  }
}
