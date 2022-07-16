export const modToFile = (
  acc: { [key in string]: { code: string } },
  curr: any
) => ({
  ...acc,
  [curr.name as string]: { active: curr.isEntry, code: curr.value },
});

export const modToStackblitzFile = (
  acc: { [key in string]: string },
  curr: any
) => ({
  ...acc,
  [curr.name.substr(1) as string]: curr.value,
});

export const isDirectory = (file: string) => file[file.length - 1] === '/';
