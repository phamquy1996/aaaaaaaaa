import { animate, animation, keyframes, style } from '@angular/animations';

export const slideIn = animation(
  [
    style({
      opacity: 0,
      transform: '{{ translateX }}',
    }),
    animate(
      '{{ time }}',
      style({
        opacity: 1,
        transform: 'translateX(0)',
      }),
    ),
  ],
  { params: { time: '200ms ease-in', translateX: 'translateX(10%)' } },
);

export const slideOut = animation(
  [
    style({
      opacity: 1,
      transform: 'translateX(0)',
    }),
    animate(
      '{{ time }}',
      style({
        opacity: 0,
        transform: '{{ translateX }}',
      }),
    ),
  ],
  { params: { time: '200ms ease-in', translateX: 'translateX(10%)' } },
);

export const fadeIn = animation(
  [
    style({
      opacity: 0,
    }),
    animate(
      '{{ time }}',
      style({
        opacity: 1,
      }),
    ),
  ],
  { params: { time: '200ms' } },
);

export const fadeOut = animation(
  [
    style({
      opacity: 1,
    }),
    animate(
      '{{ time }}',
      style({
        opacity: 0,
      }),
    ),
  ],
  { params: { time: '200ms' } },
);

export const pulse = animation(
  [
    style({
      transform: 'scale(0.7)',
    }),
    animate(
      '{{ time }}',
      keyframes([
        style({ transform: 'scale(0.7)', offset: 0 }),
        style({ transform: 'scale(1.35)', offset: 0.8 }),
        style({ transform: 'scale(1)', offset: 1 }),
      ]),
    ),
  ],
  { params: { time: '200ms' } },
);
