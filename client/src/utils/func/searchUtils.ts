type GenericDataType = { [key: string]: any };

export function search<T extends GenericDataType>(
  data: T[],
  term: string,
  fields: (keyof T)[],
): T[] {
  const searchWords = term.toLowerCase().split(" ");

  return data.filter((item) =>
    searchWords.every((word) =>
      fields.some((field) => {
        const value = item[field];
        return typeof value === "string" && value.toLowerCase().includes(word);
      }),
    ),
  );
}
