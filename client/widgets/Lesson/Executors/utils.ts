export const modToFile = (
  acc: { [key in string]: { code: string } },
  curr: any
) => ({
  ...acc,
  [curr.name as string]: { code: curr.value },
});
