const isbn13RegExp = new RegExp(/\d{13}/);

/**
 * Check if given string is a valid ISBN-13 based on
 * {@link https://isbn-information.com/the-13-digit-isbn.html| this guide}.
 * @param possibleISBN13 string
 * @returns boolean
 */
export default function validateISBN13(possibleISBN13: string) {
  const is13Digits = isbn13RegExp.test(possibleISBN13);

  if (!is13Digits) {
    return false;
  }

  const checkDigitIndex = possibleISBN13.length - 1;
  const checkDigit = possibleISBN13[checkDigitIndex];
  const restOfDigits = possibleISBN13.slice(0, checkDigitIndex);

  // evaluate ISBN13:
  let sumOfWeights = 0;
  for (let i = 0; i < restOfDigits.length; i++) {
    const digitNum = Number(restOfDigits[i]);
    if (i % 2 === 0) {
      sumOfWeights += digitNum * 1;
    } else {
      sumOfWeights += digitNum * 3;
    }
  }
  const remainder = sumOfWeights % 10;

  if (remainder === 0) {
    return true;
  }

  const correctCheckDigit = 10 - remainder;
  return Number(checkDigit) === correctCheckDigit;
}
