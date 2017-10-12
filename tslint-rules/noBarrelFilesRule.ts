import * as Lint from 'tslint';
import { SourceFile } from 'typescript';

class NoBarrelFilesWalker extends Lint.RuleWalker {

  public visitSourceFile(sourceFile: SourceFile) {
    if (sourceFile.fileName.search('index.ts') > 0) {
      this.addFailureAtNode(sourceFile, 'The use of barrel files is deprecated!');
    }
  }
}

/**
 * Implementation of the no-barrel-files rule.
 */
export class Rule extends Lint.Rules.AbstractRule {

  public apply(sourceFile: SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new NoBarrelFilesWalker(sourceFile, this.getOptions()));
  }
}