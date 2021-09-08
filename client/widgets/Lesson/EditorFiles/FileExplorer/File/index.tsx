import * as React from 'react';

import Icon from '👨‍💻components/Icon';
import { IconType } from '👨‍💻components/Icon/types';
import { getExtension } from '👨‍💻widgets/Lesson/EditorV2/utils';
import StatusIndicator from '👨‍💻widgets/Lesson/Info/StatusIndicator';

import { Props as OwnProps } from '../../FilesList';

export class File extends React.PureComponent<Props & OwnProps> {
  selectFile = (): void => {
    if (this.props.selectFile) {
      this.props.selectFile(this.props.path);
    }
  };

  getImageSrc = (path?: string) => {
    const defaultImg =
      'https://codesandbox.io/static/media/folderOpen.6913563c.svg';
    if (this.props.isDirectory || !path) return defaultImg;
    const ext = getExtension(path);

    const base =
      'https://cdn.jsdelivr.net/gh/PKief/vscode-material-icon-theme@master/icons';
    return `${base}/${ext}.svg`;
  };

  isEntry = (file?: string) =>
    file &&
    this.props.codeModules?.find(({ name }) => name!.indexOf(file) > -1)
      ?.isEntry;

  render(): React.ReactElement {
    const fileName = this.props.path.split('/').filter(Boolean).pop();

    return (
      <button
        className="w-full bg-bg-primary text-text-primary flex justify-between items-center focus:outline-none group h-5"
        data-active={this.props.active}
        onClick={this.props.selectFile ? this.selectFile : this.props.onClick}
        style={{ paddingLeft: 8 * this.props.depth + 'px' }}
        type="button"
      >
        <div className="flex items-center overflow-hidden whitespace-nowrap">
          <img className="w-3 mr-1" src={this.getImageSrc(fileName)} />
          <div className="overflow-ellipsis">{fileName}</div>
        </div>
        <div className="flex items-center pr-2">
          {this.props.isEditing && this.props.isDirectory && (
            <div className="flex items-center">
              <Icon
                className="hidden group-hover:block text-xs ml-1"
                name={'folder'}
              />
              <Icon
                className="hidden group-hover:block text-xs ml-1"
                name={'file-empty'}
              />
            </div>
          )}
          {this.props.isEditing &&
            this.props.onUpdateCodeModuleEntryFile &&
            !this.props.isDirectory && (
              // update entry file
              <Icon
                className={`empty-star hidden group-hover:block text-xs ml-1`}
                name={
                  `${
                    this.isEntry(fileName) ? 'star' : 'star-empty'
                  }` as IconType
                }
                onClick={() =>
                  this.props.onUpdateCodeModuleEntryFile &&
                  this.props.onUpdateCodeModuleEntryFile({
                    variables: {
                      newId: this.props.codeModules?.find(({ name }) =>
                        name?.includes(fileName!)
                      )?.id,
                      oldId: this.props.codeModules?.find(
                        ({ isEntry }) => !!isEntry
                      )?.id,
                    },
                  })
                }
              />
            )}
          {this.props.isEditing &&
            fileName &&
            !fileName.includes('spec') &&
            !this.isEntry(fileName) && (
              <Icon
                className={
                  'text-text-primary text-xs ml-1 hidden group-hover:block'
                }
                name="cancel-circled"
                onClick={() =>
                  this.props.onDelete(fileName!, this.props.isDirectory)
                }
              />
            )}
          {this.props.active && (
            <div className="ml-1 flex items-center">
              <StatusIndicator isPreviewing={this.props.isPreviewing} />
            </div>
          )}
        </div>
      </button>
    );
  }
}

export interface Props {
  active?: boolean;
  depth: number;
  isDirectory: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  path: string;
  selectFile?: (path: string) => void;
}
