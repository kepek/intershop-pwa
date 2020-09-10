import { Demo } from './demo.model';

export class DemoHelper {
  static equal(demo1: Demo, demo2: Demo): boolean {
    return !!demo1 && !!demo2 && demo1.id === demo2.id;
  }
}
