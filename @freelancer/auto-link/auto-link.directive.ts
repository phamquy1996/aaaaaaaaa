import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  EmbeddedViewRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  Renderer2,
  SimpleChange,
  SkipSelf,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { LinkshimComponent } from '@freelancer/components/linkshim';
import { LinkColor, LinkComponent, LinkHoverColor } from '@freelancer/ui/link';
import { HighlightColor, TextSize } from '@freelancer/ui/text';
import Autolinker, { AutolinkerConfig, Match } from 'autolinker';

type LinkMatch = Match & { getUrl(): string };

interface LinkProperties {
  readonly color: LinkColor;
  readonly highlightColor?: HighlightColor;
  readonly hoverColor: LinkHoverColor;
  readonly link: string;
  readonly newTab: boolean;
  readonly size: TextSize;
}

@Directive({ selector: '[flAutoLink]' })
export class AutoLinkDirective implements AfterViewInit, OnInit, OnDestroy {
  /**
   * Default true, true will change the linkification output to `fl-linkshim`
   * while false will change the output to `fl-link`
   */
  @Input('flAutoLink') flAutoLinkShim = true;

  @Input() flAutoLinkHoverColor = LinkHoverColor.DEFAULT;
  @Input() flAutoLinkColor = LinkColor.DEFAULT;
  @Input() flAutoLinkHighlightColor?: HighlightColor;

  private componentInstances: ComponentRef<
    LinkshimComponent | LinkComponent
  >[] = [];
  private embeddedViewRef: EmbeddedViewRef<any>;

  constructor(
    private containerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private resolver: ComponentFactoryResolver,
    @SkipSelf() protected renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    this.embeddedViewRef = this.containerRef.createEmbeddedView(
      this.templateRef,
    );
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.linkifyContent(this.embeddedViewRef.rootNodes[0]);
      this.embeddedViewRef.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this.embeddedViewRef.destroy();
    this.destroyLinks();
  }

  linkifyContent(root: HTMLElement) {
    this.destroyLinks();
    const textNodes = this.findTextNodes(root);
    Array.from(textNodes).forEach(textNode => {
      if (textNode.parentElement) {
        this.linkTransform(textNode.textContent || '', textNode.parentElement);
      }
    });
  }

  private destroyLinks() {
    this.componentInstances.forEach(componentInstance => {
      componentInstance.destroy();
    });
    this.componentInstances = [];
  }

  private linkTransform(
    value: string,
    parentNode: HTMLElement,
    args?: AutolinkerConfig,
  ): void {
    const matches = Autolinker.parse(value, { ...args }).filter(this.checkUrl);
    parentNode.innerHTML = '';

    let lastOffset = 0;
    const factory = this.getFactory();
    matches.forEach(match => {
      // 1. Create a text node from the given value
      const text = value.substr(lastOffset, match.getOffset() - lastOffset);
      if (text.length > 0) {
        const textNode = this.renderer.createText(text);
        this.renderer.appendChild(parentNode, textNode);
      }
      lastOffset = match.getOffset() + match.getMatchedText().length;

      // 2. Create fl-link component
      this.renderLinkComponent(factory, match.getMatchedText(), parentNode, {
        color: this.flAutoLinkColor,
        hoverColor: this.flAutoLinkHoverColor,
        highlightColor: this.flAutoLinkHighlightColor,
        link: match.getUrl(),
        newTab: true,
        size: TextSize.INHERIT,
      });
    });

    // 3. Create a text node if there is any text left
    if (lastOffset < value.length) {
      const textNode = this.renderer.createText(value.substr(lastOffset));
      this.renderer.appendChild(parentNode, textNode);
    }
  }

  private getFactory(): ComponentFactory<LinkshimComponent | LinkComponent> {
    if (this.flAutoLinkShim) {
      return this.resolver.resolveComponentFactory(LinkshimComponent);
    }

    return this.resolver.resolveComponentFactory(LinkComponent);
  }

  private checkUrl(match: Match): match is LinkMatch {
    return match.getType() === 'url';
  }

  /**
   * Create a valid `fl-link` component
   *
   * @param factory
   * @param content
   * @param parentNode
   * @param linkProps
   */
  private renderLinkComponent(
    factory: ComponentFactory<LinkshimComponent | LinkComponent>,
    content: string,
    parentNode: HTMLElement,
    linkProps: LinkProperties,
  ): void {
    /**
     * <fl-link ...>
     *     {{ content }}
     * </fl-link>
     */
    const linkComponentRef = this.containerRef.createComponent(
      factory,
      this.containerRef.length,
      this.containerRef.injector,
      [[this.renderer.createText(content)]],
    );

    /**
     * Bind inputs and fire component ngOnChanges
     */
    this.notifyInputChanges(linkComponentRef, linkProps);

    // Add created component into the array to detach from the container
    // and destory it at the `ngOnDestroy` hook
    this.componentInstances.push(linkComponentRef);

    /**
     * Move the fl-link into the parentNode
     */
    this.renderer.appendChild(
      parentNode,
      linkComponentRef.location.nativeElement,
    );
  }

  /**
   * Manually bind LinkshimComponent @Input values
   * and mark them for check.
   *
   * @param componentRef
   * @param componentProps
   */
  private notifyInputChanges(
    componentRef: ComponentRef<LinkshimComponent | LinkComponent>,
    componentProps: object,
  ) {
    const { instance } = componentRef as any;
    const changes = Object.entries(componentProps).reduce(
      (map, [key, value]) => {
        instance[key] = value;

        if (instance.ngOnChanges) {
          const change = new SimpleChange(key, value, true);

          return {
            ...map,
            [key]: change,
          };
        }

        return map;
      },
      {},
    );

    /**
     * Dynamically created components do not trigger `ngOnChanges`
     * whenever input changes. The function that performs inputs
     * checks is generated during compilation based on the template.
     * Thus, we need to trigger `ngOnChanges` manually.
     * https://github.com/angular/angular/issues/9866
     */
    if (instance.ngOnChanges) {
      instance.ngOnChanges(changes);
    }

    const { changeDetectorRef } = componentRef;
    changeDetectorRef.detectChanges();
  }

  private findTextNodes(current: Node): Node[] {
    let arr: Node[] = [];
    Array.from(current.childNodes).forEach(node => {
      if (this.isTextNode(node)) {
        arr.push(node);
      } else {
        arr = [...arr, ...this.findTextNodes(node)];
      }
    });
    return arr;
  }

  private isTextNode(node: Node): node is Text {
    return node.nodeType === Node.TEXT_NODE;
  }
}
