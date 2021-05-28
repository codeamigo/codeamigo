import * as React from 'react';

import { getExtension } from '👨‍💻widgets/Lesson/EditorV2/utils';

export interface Props {
  active?: boolean;
  depth: number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  path: string;
  selectFile?: (path: string) => void;
}

export class File extends React.PureComponent<Props> {
  selectFile = (): void => {
    if (this.props.selectFile) {
      this.props.selectFile(this.props.path);
    }
  };

  getImageSrc = (path?: string) => {
    const defaultImg =
      'https://codesandbox.io/static/media/folderOpen.6913563c.svg';
    if (!path) return defaultImg;
    const ext = getExtension(path);
    if (!ext) return defaultImg;

    const base =
      'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons';
    return `${base}/${ext}.svg`;
  };

  render(): React.ReactElement {
    const fileName = this.props.path.split('/').filter(Boolean).pop();

    return (
      <button
        className="bg-bg-primary text-text-primary flex"
        data-active={this.props.active}
        onClick={this.props.selectFile ? this.selectFile : this.props.onClick}
        style={{ paddingLeft: 8 * this.props.depth + 'px' }}
        type="button"
      >
        <img className="w-3.5 mr-1" src={this.getImageSrc(fileName)} />
        {fileName}
      </button>
    );
  }
}
