import assert from 'node:assert';

const reverseString = (stringToReverse: string) => {
  let leftPointer: number = 0;
  let rightPointer: number = stringToReverse.length - 1;
  let leftString = ''
  let rightString = ''
  while (leftPointer <= rightPointer) {
    if (leftPointer < rightPointer) {
      rightString = stringToReverse[leftPointer] + rightString;
    }
    leftString = leftString + stringToReverse[rightPointer];
    leftPointer++;
    rightPointer--;
  }

  return leftString + rightString;
};

// Tests
const string1 = 'cata';
const expectedString1 = 'atac';
const reversedString1 = reverseString(string1);
assert.equal(expectedString1, reversedString1);

const string2 = 'cat';
const reversedString2 = reverseString(string2);
const expectedString2 = 'tac';
assert.equal(expectedString2, reversedString2);

console.log('completed successfully');
