import type { SandpackBundlerFiles } from '@codesandbox/sandpack-client';
import * as React from 'react';

import { Props as OwnProps } from '../../FilesList';
import { Directory } from '../Directory';
import { File } from '../File';

export class ModuleList extends React.PureComponent<Props & OwnProps> {
  render(): JSX.Element {
    const {
      activePath,
      depth = 0,
      files,
      onDelete,
      prefixedPath,
      selectFile,
    } = this.props;

    const fileListWithoutPrefix = Object.keys(files)
      .filter((file) => file.startsWith(prefixedPath))
      .map((file) => file.substring(prefixedPath.length));

    const directoriesToShow = new Set(
      fileListWithoutPrefix
        .filter((file) => file.includes('/'))
        .map((file) => `${prefixedPath}${file.split('/')[0]}/`)
    );

    const filesToShow = fileListWithoutPrefix
      .filter((file) => !file.includes('/'))
      .map((file) => ({ path: `${prefixedPath}${file}` }));

    return (
      <div>
        {Array.from(directoriesToShow).map((dir) => (
          <Directory depth={depth + 1} key={dir} {...this.props} />
        ))}

        {filesToShow.map((file) => (
          <File
            active={activePath === file.path}
            depth={depth + 1}
            isDirectory={false}
            key={file.path}
            path={file.path}
            {...this.props}
          />
        ))}
      </div>
    );
  }
}

type Props = {
  activePath: string;
  depth?: number;
  files: SandpackBundlerFiles;
  prefixedPath: string;
  selectFile: (path: string) => void;
};
