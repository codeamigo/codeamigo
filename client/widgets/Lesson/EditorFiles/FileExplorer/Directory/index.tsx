import type { SandpackBundlerFiles } from '@codesandbox/sandpack-client';
import * as React from 'react';

import Icon from '👨‍💻components/Icon';
import AddFile from '👨‍💻widgets/Lesson/EditorFiles/FileExplorer/AddFile';

import { Props as OwnProps } from '../../FilesList';
import { File } from '../File';
import { ModuleList, Props } from '../ModuleList';

interface State {
  open: boolean;
}

export class Directory extends React.Component<Props & OwnProps, State> {
  state = {
    open: true,
  };

  componentDidUpdate(prevProps: Props & OwnProps) {
    const {
      addFileState: prevAddFileState,
      prefixedPath: prevPrefixedPath,
    } = prevProps;
    const { addFileState, prefixedPath } = this.props;

    if (
      prevPrefixedPath === addFileState.path &&
      !prevAddFileState.active &&
      addFileState.active
    ) {
      this.toggleOpen(true);
    }
  }

  toggleOpen = (open?: boolean): void => {
    this.setState((state) => ({ open: open || !state.open }));
  };

  render(): React.ReactElement {
    const { addFileState, prefixedPath } = this.props;

    return (
      <>
        <div key={prefixedPath}>
          <File
            {...this.props}
            depth={this.props.depth || 0}
            isDirectory
            isDirectoryOpen={this.state.open}
            onClick={() => this.toggleOpen()}
            path={prefixedPath}
            selectFile={undefined}
          />
          {addFileState.active && prefixedPath === addFileState.path && (
            <AddFile {...this.props} />
          )}
          {this.state.open ? <ModuleList {...this.props} /> : null}
        </div>
      </>
    );
  }
}
