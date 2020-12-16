import { FieldError } from "../generated/graphql";

export const toErrorMap = (errors: FieldError[]) => {
  const errorMap: Record<string, string> = {};
  errors.forEach(({ field, message }) => {
    errorMap[field] = message;
  });
  return errorMap;
};

export const monacoFileLanguage = (ext: string) => {
  switch (ext) {
    case "tsx":
      return "javascript";
    case "ts":
      return "typescript";
    default:
      return ext;
  }
};
