import { DefaultUrlSerializer, UrlTree } from '@angular/router';

export class CamUrlSerializer implements CamUrlSerializer {
  private dus = new DefaultUrlSerializer();

  parse(url: string): UrlTree {
    return this.dus.parse(url);
  }

  serialize(tree: UrlTree): string {
    return this.dus.serialize(tree);
  }
}
