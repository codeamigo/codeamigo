export const modToFile = (
  acc: { [key in string]: { code: string } },
  curr: any
) => ({
  ...acc,
  [curr.name as string]: { code: curr.value },
});

export const modToStackblitzFile = (
  acc: { [key in string]: string },
  curr: any
) => ({
  ...acc,
  [curr.name.substr(1) as string]: curr.value,
});
