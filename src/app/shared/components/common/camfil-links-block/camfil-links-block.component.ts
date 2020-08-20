import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'camfil-links-block',
  templateUrl: './camfil-links-block.component.html',
  styleUrls: ['./camfil-links-block.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilLinksBlockComponent {
  @Input() title: string;

  links: Link[] = [
    {
      name: 'How to measure a bag filter',
      href: '#',
    },
    {
      name: 'How to find the correct basket',
      href: '#',
    },
    {
      name: 'Another guide here',
      href: '#',
    },
    {
      name: 'Another guide here',
      href: '#',
    },
  ];
}

interface Link {
  name: string;
  href: string;
}
