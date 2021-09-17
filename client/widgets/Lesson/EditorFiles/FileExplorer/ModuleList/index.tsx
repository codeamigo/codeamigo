import type { SandpackBundlerFiles } from '@codesandbox/sandpack-client';
import * as React from 'react';

import { FileSystemStateType, Props as OwnProps } from '../../FilesList';
import { Directory } from '../Directory';
import { File } from '../File';

export class ModuleList extends React.PureComponent<Props & OwnProps> {
  render(): JSX.Element {
    const { activePath, depth = 0, files, prefixedPath } = this.props;
    const sortAbc = (a: string, b: string) => (a < b ? -1 : 1);

    const fileListWithoutPrefix = Object.keys(files)
      .filter((file) => file.startsWith(prefixedPath))
      .map((file) => file.substring(prefixedPath.length));

    const directoriesToShow = new Set(
      fileListWithoutPrefix
        .filter((file) => file.includes('/'))
        .sort(sortAbc)
        .map((file) => `${prefixedPath}${file.split('/')[0]}/`)
    );

    const filesToShow = fileListWithoutPrefix
      .filter(Boolean)
      .filter((file) => !file.includes('/'))
      .sort(sortAbc)
      .map((file) => ({ path: `${prefixedPath}${file}` }));

    return (
      <div>
        {Array.from(directoriesToShow).map((dir) => (
          <Directory
            {...this.props}
            depth={depth + 1}
            key={dir}
            prefixedPath={dir}
          />
        ))}

        {filesToShow.map((file) => (
          <File
            {...this.props}
            active={activePath === file.path}
            depth={depth + 1}
            isDirectory={false}
            key={file.path}
            path={file.path}
          />
        ))}
      </div>
    );
  }
}

export type Props = {
  activePath: string;
  addFileState: FileSystemStateType;
  depth?: number;
  error?: string;
  files: SandpackBundlerFiles;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  prefixedPath: string;
  selectFile: (path: string) => void;
  setAddFileState: React.Dispatch<React.SetStateAction<FileSystemStateType>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
};
