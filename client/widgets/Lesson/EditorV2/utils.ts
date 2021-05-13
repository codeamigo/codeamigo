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
    case 'spec':
      return 'typescript';
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'vue':
      return 'vue';
    default:
      return ext;
  }
};

export const getModelExtension = (file: string) => {
  const ext = file.split('.')[1];

  switch (ext) {
    case 'vue':
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'md':
      return 'markdown';
    case 'ts':
    case 'tsx':
    case 'spec':
      return 'typescript';
    case 'js':
    case 'jsx':
      return 'javascript';
    default:
      return ext;
  }
};

export const camalize = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
};
