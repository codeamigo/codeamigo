import { FileSystemType } from '👨‍💻widgets/Lesson/EditorFiles/FilesList';

const validExt = ['js', 'jsx', 'ts', 'tsx', 'css', 'html'];

export const isValidName = (
  name: string,
  type: keyof typeof FileSystemType,
  files?: Array<string>
): { reason: string; valid: boolean } => {
  let result = { reason: '', valid: true };

  if (name.includes('/')) {
    result.valid = false;
    result.reason === 'Cannot include "/"';
    return result;
  }

  if (type === 'file' && (!name.includes('.') || !name.split('.')[1])) {
    result.valid = false;
    result.reason = 'File name must include an extension.';
    return result;
  }

  if (type === 'folder' && name.includes('.')) {
    result.valid = false;
    result.reason = 'Folder cannot include "."';
    return result;
  }

  if (files && files.includes(name)) {
    result.valid = false;
    result.reason = 'Filename already taken.';
    return result;
  }

  return result;
};
