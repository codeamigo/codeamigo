import { FieldError } from '../generated/graphql';

export const toErrorMap = (errors: FieldError[]) => {
  const errorMap: Record<string, string> = {};
  errors.forEach(({ field, message }) => {
    errorMap[field] = message;
  });
  return errorMap;
};

export const getFileExt = (ext: string) => {
  return ext.split('.')[ext.split('.').length - 1];
};

export const monacoFileLanguage = (ext: string) => {
  switch (ext) {
    case 'tsx':
      return 'javascript';
    case 'ts':
      return 'typescript';
    default:
      return ext;
  }
};

export const githubFileLanguage = (ext: string) => {
  switch (ext) {
    case 'css':
      return 'CSS';
    case 'html':
      return 'HTML';
    case 'jsx':
    case 'js':
      return 'JavaScript';
    case 'tsx':
    case 'ts':
      return 'TypeScript';
    default:
      return ext;
  }
};
