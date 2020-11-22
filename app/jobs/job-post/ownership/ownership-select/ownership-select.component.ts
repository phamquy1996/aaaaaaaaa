import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OwnershipType } from '@freelancer/datastore/collections';
import { CardLevel } from '@freelancer/ui/card';
import { HeadingType } from '@freelancer/ui/heading';
import { ListItemPadding } from '@freelancer/ui/list-item';
import { Margin } from '@freelancer/ui/margin';
import { FontWeight, TextSize } from '@freelancer/ui/text';

@Component({
  selector: 'app-ownership-select',
  template: `
    <fl-heading
      i18n="Post Job Page ownership heading"
      [headingType]="HeadingType.H3"
      [flMarginBottom]="Margin.XXSMALL"
      [size]="TextSize.MID"
    >
      Who are you posting this project for?
    </fl-heading>
    <fl-bit [flMarginBottom]="Margin.LARGE">
      <fl-grid>
        <fl-col [col]="12" [colTablet]="6">
          <fl-card
            class="Card"
            [edgeToEdge]="true"
            [level]="CardLevel.SECONDARY"
          >
            <fl-list
              [selectable]="true"
              [clickable]="true"
              [padding]="ListItemPadding.MID"
            >
              <fl-list-item
                flTrackingLabel="SelfPost"
                [control]="control"
                [radioValue]="OwnershipType.SELF"
                [selectable]="true"
              >
                <fl-text
                  i18n="Post Job Page form ownership self title"
                  [size]="TextSize.SMALL"
                  [weight]="FontWeight.BOLD"
                >
                  Post for myself
                </fl-text>
              </fl-list-item>
            </fl-list>
          </fl-card>
        </fl-col>
        <fl-col [col]="12" [colTablet]="6">
          <fl-card
            class="Card"
            [edgeToEdge]="true"
            [level]="CardLevel.SECONDARY"
          >
            <fl-list
              [selectable]="true"
              [clickable]="true"
              [padding]="ListItemPadding.MID"
            >
              <fl-list-item
                flTrackingLabel="OnBehalfPost"
                [control]="control"
                [radioValue]="OwnershipType.OTHER_USER"
                [selectable]="true"
              >
                <fl-text
                  i18n="Post Job Page form ownership other user title"
                  [size]="TextSize.SMALL"
                  [weight]="FontWeight.BOLD"
                >
                  Post on behalf of someone else
                </fl-text>
              </fl-list-item>
            </fl-list>
          </fl-card>
        </fl-col>
      </fl-grid>
    </fl-bit>
  `,
  styleUrls: ['./ownership-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnershipSelectComponent {
  CardLevel = CardLevel;
  TextSize = TextSize;
  FontWeight = FontWeight;
  HeadingType = HeadingType;
  ListItemPadding = ListItemPadding;
  Margin = Margin;
  OwnershipType = OwnershipType;

  @Input() control: FormControl;
}
