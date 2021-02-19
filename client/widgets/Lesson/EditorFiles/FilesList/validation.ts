const validExt = ['js', 'jsx', 'ts', 'tsx', 'css', 'html'];

export const isValidName = (
  name: string,
  files?: Array<string>
): { reason: string; valid: boolean } => {
  let result = { reason: '', valid: true };

  if (!name.includes('.') || !name.split('.')[1]) {
    result.valid = false;
    result.reason = 'File name must include an extension.';
    return result;
  }

  if (files && files.includes(name)) {
    result.valid = false;
    result.reason = 'Filename already taken.';
    return result;
  }

  if (name.split('.')[1] === 'html' && files && files.includes('index.html')) {
    result.valid = false;
    result.reason = 'Only index.html allowed.';
    return result;
  }

  if (name.split('.')[1] === 'html' && name.split('.')[0] !== 'index') {
    result.valid = false;
    result.reason = 'Only index.html allowed.';
    return result;
  }

  return result;
};
