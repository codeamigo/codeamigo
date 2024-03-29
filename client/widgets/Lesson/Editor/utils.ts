export const getLanguage = (file: string) => {
  const ext = file.split('.')[file.split('.').length - 1];

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
    case 'rb':
      return 'ruby';
    case 'rs':
      return 'rust';
    case 'c':
      return 'c';
    case 'exs':
      return 'elixir';
    case 'py':
      return 'python';
    case 'scss':
      return 'sass';
    case 'gitignore':
      return 'git';
    default:
      return ext;
  }
};

export const getModelExtension = (file: string) => {
  const ext = file.split('.')[file.split('.').length - 1];

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
    case 'rb':
      return 'ruby';
    case 'rs':
      return 'rust';
    case 'c':
      return 'c';
    case 'exs':
      return 'elixir';
    default:
      return ext;
  }
};

export const camalize = (str: string) => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
};
