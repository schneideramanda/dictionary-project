export const parsePositiveInteger = (value, defaultValue, maxValue) => {
  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isFinite(parsedValue)) {
    return defaultValue;
  }

  return Math.min(Math.max(parsedValue, 1), maxValue);
};

export const parsePage = value => parsePositiveInteger(value, 1, Number.MAX_SAFE_INTEGER);

export const parseLimit = value => parsePositiveInteger(value, 20, 100);
