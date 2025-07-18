const reverseString = (stringToReverse: string) => {
  let leftPointer = 0;
  let rightPointer = stringToReverse.length - 1;
  const newStringArray = [];
  while (leftPointer <= rightPointer) {
    if (leftPointer < rightPointer) {
      newStringArray[rightPointer] = stringToReverse[leftPointer];
    }
    newStringArray[leftPointer] = stringToReverse[rightPointer];
    leftPointer++;
    rightPointer--;
  }

  return newStringArray.join('');
};

const string1 = 'cata';

const reversedString1 = reverseString(string1);

console.log(reversedString1);

const string2 = 'cat';

const reversedString2 = reverseString(string2);

console.log(reversedString2);
