export const selectFirstLine = (content: string) => {
  return content
    .split(/\n|<\/p>/)[0] // Remove everything after the first newline or </p> tag
    .replace(/(<([^>]+)>)/gi, " ") // Remove HTML tags
    .trim();
}