// from sandpack
export const getFileName = (filePath: string) => {
  var lastIndexOfSlash = filePath.lastIndexOf('/');
  return filePath.slice(lastIndexOfSlash + 1);
};
