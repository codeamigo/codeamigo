export const randomHexColor = () => {
  return (
    "#" +
    ("000000" + Math.floor(Math.random() * 16777215).toString(16)).slice(-6)
  );
};

export const generateProfileScheme = () => {
  const chin = randomHexColor();
  const ear = randomHexColor();
  const face = randomHexColor();
  const eye = randomHexColor();

  const profileColorScheme = `${chin}-${ear}-${face}-${eye}`;

  return profileColorScheme;
};
