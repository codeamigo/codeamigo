import type { SandpackBundlerFiles } from '@codesandbox/sandpack-client';
import * as React from 'react';

import { Props as OwnProps } from '../../FilesList';
import { File } from '../File';
import { ModuleList } from '../ModuleList';

interface State {
  open: boolean;
}

export class Directory extends React.Component<Props & OwnProps, State> {
  state = {
    open: true,
  };

  toggleOpen = (): void => {
    this.setState((state) => ({ open: !state.open }));
  };

  render(): React.ReactElement {
    const { depth, onDelete, prefixedPath } = this.props;

    return (
      <div key={prefixedPath}>
        <File
          isDirectory
          onClick={this.toggleOpen}
          path={prefixedPath + '/'}
          {...this.props}
        />

        {this.state.open ? <ModuleList {...this.props} /> : null}
      </div>
    );
  }
}

export interface Props {
  activePath: string;
  depth: number;
  files: SandpackBundlerFiles;
  prefixedPath: string;
  selectFile: (path: string) => void;
}
