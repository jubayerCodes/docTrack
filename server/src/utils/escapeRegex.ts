/**
 * Safely escapes regular expression special characters to prevent
 * ReDoS (Regular Expression Denial of Service) and MongoDB $regex syntax errors.
 */
export const escapeRegex = (text: string): string => {
  if (!text) return '';
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};
