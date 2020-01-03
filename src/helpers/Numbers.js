const SUFFIXES = ['k', 'M', 'B', 'T', 'Q'];

class NumbersHelper {
  static makeNumberHumanReadable = inputNumber => {
    let chosenSuffix = '';
    let minimalNumber = parseFloat(inputNumber);

    for (let i = 1, j = SUFFIXES.length + 1; i < j; i += 1) {
      const checkNum = inputNumber / 1000 ** i;
      if (checkNum > 1) {
        chosenSuffix = SUFFIXES[i - 1];
        minimalNumber = checkNum;
      } else {
        break;
      }
    }

    const integerPart = Math.floor(minimalNumber);
    let decimalPart = minimalNumber.toString().split('.')[1];
    if (decimalPart) {
      decimalPart = decimalPart.slice(0, 1);
      return `${integerPart}.${decimalPart}${chosenSuffix}`;
    }
    // This should sufficiently annoy anyone who cares about sig-figs
    // oh god, as soon as I piped in real data it was the first thing I went to fix. -CENG
    return `${integerPart}${chosenSuffix}`;
  };

  static makeNumberComputerReadable = compressedNumberString => {
    // console.log(compressedNumberString);
    for (let i = 0, j = SUFFIXES.length; i < j; i += 1) {
      const suffix = SUFFIXES[i];
      if (compressedNumberString.indexOf(suffix) > -1) {
        const numberPart = parseFloat(
          compressedNumberString.replace(suffix, ''),
        );
        const multiplier = 1000 ** (i + 1);
        // console.log(numberPart * multiplier);
        return numberPart * multiplier;
      }
    }
    return parseInt(compressedNumberString, 10);
  };
}

module.exports = NumbersHelper;
