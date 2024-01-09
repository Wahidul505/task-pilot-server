export const exclude = (object: any, keys: string[]) => {
  console.log(object);
  return Object.fromEntries(
    Object.entries(object).filter(([key]) => !keys.includes(key))
  );
};
