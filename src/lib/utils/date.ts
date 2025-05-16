export const formatDate = (date: number) => {
  return new Date(date)
    .toLocaleString()
    .split(":")
    .slice(0, 2)
    .join(":")
    .replace(", ", " - ");
};
