import type { SandpackBundlerFiles } from '@codesandbox/sandpack-client';
import * as React from 'react';

import { File } from '../File';
import { ModuleList } from '../ModuleList';

interface State {
  open: boolean;
}

export class Directory extends React.Component<Props, State> {
  state = {
    open: true,
  };

  toggleOpen = (): void => {
    this.setState((state) => ({ open: !state.open }));
  };

  render(): React.ReactElement {
    const {
      activePath,
      depth,
      files,
      onDelete,
      prefixedPath,
      selectFile,
    } = this.props;

    return (
      <div key={prefixedPath}>
        <File
          depth={depth}
          isDirectory
          onClick={this.toggleOpen}
          onDelete={onDelete}
          path={prefixedPath + '/'}
        />

        {this.state.open ? (
          <ModuleList
            activePath={activePath}
            depth={depth}
            files={files}
            onDelete={onDelete}
            prefixedPath={prefixedPath}
            selectFile={selectFile}
          />
        ) : null}
      </div>
    );
  }
}

export interface Props {
  activePath: string;
  depth: number;
  files: SandpackBundlerFiles;
  onDelete: (path: string, isDirectory?: boolean) => void;
  prefixedPath: string;
  selectFile: (path: string) => void;
}
