export const getExtension = (file: string) => {
  const ext = file.split('.')[1];

  switch (ext) {
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'md':
      return 'markdown';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'js':
    case 'jsx':
      return 'javascript';
    default:
      return ext;
  }
};
