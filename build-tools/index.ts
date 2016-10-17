import { readFileSync, writeFileSync, statSync, Stats } from 'fs';
import * as colors from 'colors';
import * as ts from 'typescript';
import * as Lint from 'tslint/lib/lint';
import * as Linter from 'tslint/lib/tslint';
import * as _ from 'lodash';

type MessageCategory = 'error' | 'warning' | 'info' | 'log' | 'debug';

interface ITSMessage {
  message: string;
  line: number;
  character: number;
  issuer: string;
  category: MessageCategory;
  type: string;
}

interface IFileMessages {
  fileName: string;
  path: string;
  messages: ITSMessage[];
}

interface IFileErrorsMap {
  [key: string]: IFileMessages;
}

interface IProject {
  name: string;
  files: string[];
}

function getDiagnosticCategory(category: ts.DiagnosticCategory): MessageCategory {
  const map: { [key: number]: MessageCategory } = {
    [ts.DiagnosticCategory.Error]: 'error',
    [ts.DiagnosticCategory.Warning]: 'warning',
    [ts.DiagnosticCategory.Message]: 'log',
  };
  return map[category];
}

function _parseJSONFile(fileName: string): any {
  try {
    return JSON.parse(readFileSync(fileName, 'utf8'));
  } catch (e) {
    return null;
  }
}

function getProjectConfig(name: string): any {
  const config: string = `${process.cwd()}/${name}.json`;
  return _parseJSONFile(config);
}

function filterModifiedFiles(project: IProject, targetDir: string, force?: boolean): string[] {
  const statsFile: string = `${targetDir}/.ts-stats.json`;
  let projectTimes: any = _parseJSONFile(statsFile) || {};
  let cached: boolean = true;
  if (!projectTimes[project.name]) {
    projectTimes[project.name] = {};
    cached = false;
  }
  if (!cached || force) {
    return project.files;
  }

  const times: any = projectTimes[project.name];
  const filesToFilter: string[] = _.keys(times);
  _.each(project.files, (fname) => {
    if (!_.includes(filesToFilter, fname)) {
      filesToFilter.push(fname);
      times[fname] = 0;
    }
  });
  return _.filter(filesToFilter, (fileName) => {
    const stats: Stats = statSync(fileName);
    return times[fileName] === 0 || stats.mtime > new Date(times[fileName]);
  });
}

function storeModifiedDates(
  project: IProject,
  results: IFileErrorsMap,
  emittedFiles: string[],
  targetDir: string,
): void {
  const statsFile: string = `${targetDir}/.ts-stats.json`;
  let projectTimes: any = _parseJSONFile(statsFile) || {};
  if (!projectTimes[project.name]) {
    projectTimes[project.name] = {};
  }
  const times: any = projectTimes[project.name];
  _.each(emittedFiles, (fileName) => {
    const stats: Stats = statSync(fileName);
    const result: IFileMessages = _.find(results, (file: IFileMessages) => {
      return file.path === fileName;
    });
    if (result && result.messages.length) {
      times[fileName] = 0;
    } else {
      times[fileName] = stats.mtime;
    }
  });
  writeFileSync(statsFile, JSON.stringify(projectTimes, null, 2));
}

function compile(
  project: IProject,
  tsOptions: ts.CompilerOptions,
  lintOptions?: Lint.ILinterOptionsRaw,
  force?: boolean,
): IFileErrorsMap {
  const results: IFileErrorsMap = {};
  const modifiedFiles: string[] = filterModifiedFiles(project, tsOptions.outDir || '.', force);
  if (!modifiedFiles.length) {
    return results;
  }
  const program: ts.Program = ts.createProgram(modifiedFiles, tsOptions);
  const emitResult: ts.EmitResult = program.emit();
  const preDiagnostics: ts.Diagnostic[] = ts.getPreEmitDiagnostics(program);
  const allDiagnostics: ts.Diagnostic[] = preDiagnostics.concat(emitResult.diagnostics);
  const emittedFiles: ts.SourceFile[] = program.getSourceFiles()
    .filter(x => !_.includes(x.fileName, 'node_modules'));

  _.each(allDiagnostics, (diagnostic) => {
    const file: ts.SourceFile = diagnostic.file;
    const fileName: string = file.fileName;
    if (!results[fileName]) {
      results[fileName] = {
        fileName,
        path: file.path,
        messages: [],
      };
    }
    const fileMessages: IFileMessages = results[fileName];
    const pos: ts.LineAndCharacter = file.getLineAndCharacterOfPosition(diagnostic.start);
    const message: string = ts.flattenDiagnosticMessageText(diagnostic.messageText, '');

    fileMessages.messages.push({
      message,
      line: pos.line + 1,
      character: pos.character + 1,
      issuer: 'typescript',
      category: getDiagnosticCategory(diagnostic.category),
      type: `TS${diagnostic.code}`,
    });
    fileMessages.messages.sort((a, b) => a.line - b.line);
  });

  if (lintOptions) {
    _.each(emittedFiles, (file) => {
      const fileName: string = file.fileName;
      const linter: Linter = new Linter(
        file.fileName, '', {
          configuration: lintOptions,
          formatter: 'json',
        },
        program
      );
      const lintResults: Lint.LintResult = linter.lint();
      const failures: any = JSON.parse(lintResults.output);
      if (!results[fileName]) {
        results[fileName] = {
          fileName,
          path: file.path,
          messages: [],
        };
      }
      const fileMessages: IFileMessages = results[fileName];
      _.each(failures, (failure) => {
        const { line, character }: any = failure.startPosition;
        fileMessages.messages.push({
          message: failure.failure,
          line: line + 1,
          character: character + 1,
          issuer: 'tslint',
          category: 'warning',
          type: failure.ruleName,
        });
      });
      fileMessages.messages.sort((a, b) => a.line - b.line);
    });
  }
  storeModifiedDates(project, results, emittedFiles.map(x => x.path), tsOptions.outDir || '.');

  return results;
}

function align(msg: string, alignment: 'l' | 'r', size: number): string {
  if (alignment === 'l') {
    return msg + _.repeat(' ', size - msg.length);
  }

  return  _.repeat(' ', size - msg.length) + msg;
}

function breakMsg(msg: string, size: number): string[] {
  const result: string[] = [];
  const words: string[] = msg.split(' ');
  const line: string[] = [];
  let length: number = 0;
  _.each(words, (word) => {
    if (length + word.length <= size) {
      line.push(word);
      length += word.length + 1;
    } else {
      result.push(line.join(' '));
      line.splice(0);
      line.push(word);
      length = word.length + 1;
    }
  });
  result.push(line.join(' ').trim());
  return result;
}

function _formatResults(buf: string[], messages: string[][]): void {
  const colSizes: number[] = [0, 0, 0, 0];
  _.each(messages, (msg) => {
    _.each(msg, (item, index) => {
      if (item.length > colSizes[index]) {
        colSizes[index] = Math.min(item.length, 80);
      }
    });
  });

  const colorMap: { [key: string]: Function } = {
    error: colors.red,
    warning: colors.yellow,
    info: colors.blue,
    log: colors.cyan,
    debug: colors.gray,
  };

  _.each(messages, (msg) => {
    const main: string[] = breakMsg(msg[3], colSizes[3]);
    buf.push('  ');
    buf.push(colorMap[msg[0]](align(msg[1], 'r', colSizes[1])));
    buf.push(':');
    buf.push(colorMap[msg[0]](align(msg[2], 'l', colSizes[2])));
    buf.push('  ');
    if (main.length > 1) {
      buf.push(align(main[0], 'l', colSizes[3]));
    } else {
      buf.push(colors.underline(align(main[0], 'l', colSizes[3])));
    }
    buf.push('  ');
    buf.push(colorMap[msg[0]](align(msg[4], 'l', colSizes[4])).dim);
    buf.push('\n');
    if (main.length > 1) {
      const indent: string = _.repeat(' ', 5 + colSizes[1] + colSizes[2]);
      _.each(main.slice(1), (line, index) => {
        const lineMsg: string = align(line, 'l', colSizes[3]);
        if (index === main.length - 2) {
          buf.push(`${indent}${lineMsg.underline}`);
        } else {
          buf.push(`${indent}${lineMsg}`);
        }
        buf.push('\n');
      });
    }
  });
}

function formatResults(results: IFileErrorsMap): string {
  const buffer: string[] = [];
  const fileNames: string[] = _.keys(results).sort();
  _.each(fileNames, fileName => {
    const obj: IFileMessages = results[fileName];
    const numMessages: number = obj.messages.length;
    if (!numMessages) {
      return;
    }

    const foundMessageWord: string = `MESSAGE${numMessages === 1 ? '' : 'S'}`;
    const messageInfo: string = `${numMessages} ${foundMessageWord}`;
    buffer.push(`\n${messageInfo.magenta} in ${fileName.underline.magenta}:\n`);
    buffer.push('\n');

    const messages: string[][] = [];
    _.each(obj.messages, (msg: ITSMessage) => {
      messages.push([
        msg.category,
        msg.line.toString(),
        msg.character.toString(),
        msg.message,
        msg.type,
      ]);
    });

    _formatResults(buffer, messages);
  });
  return buffer.join('');
}

export {
  IProject,
  MessageCategory,
  ITSMessage,
  IFileMessages,
  IFileErrorsMap,
  compile,
  getProjectConfig,
  formatResults,
};
