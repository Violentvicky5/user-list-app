const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export function validateUserQuery({ page, limit }) {
  let parsedPage = Number(page);
  let parsedLimit = Number(limit);

  if (!parsedPage || parsedPage < 1) {
    parsedPage = DEFAULT_PAGE;
  }

  if (!parsedLimit || parsedLimit < 1) {
    parsedLimit = DEFAULT_LIMIT;
  }

  if (parsedLimit > MAX_LIMIT) {
    parsedLimit = MAX_LIMIT;
  }

  return {
    page: parsedPage,
    limit: parsedLimit,
  };
}
