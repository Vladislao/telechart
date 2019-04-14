const FALLBACK = [Infinity, -Infinity];

const isPowerOfTwo = number => {
  if (number < 1) {
    return false;
  }
  return (number & (number - 1)) === 0;
};

const getSegmentTreeLength = length => {
  if (isPowerOfTwo(length)) {
    return 2 * length - 1;
  }

  const currentPower = Math.floor(Math.log2(length));
  const nextPower = currentPower + 1;
  const nextPowerOfTwoNumber = 2 ** nextPower;
  return 2 * nextPowerOfTwoNumber - 1;
};

const getLeftChildIndex = position => 2 * position + 1;

const getRightChildIndex = position => 2 * position + 2;

const createRecursively = (tree, data, left, right, position) => {
  if (left === right) {
    tree[position] = [data[left], data[left]];
    return tree;
  }

  const middle = Math.floor((left + right) / 2);
  createRecursively(tree, data, left, middle, getLeftChildIndex(position));
  createRecursively(
    tree,
    data,
    middle + 1,
    right,
    getRightChildIndex(position)
  );

  const leftValue = tree[getLeftChildIndex(position)];
  const rightValue = tree[getRightChildIndex(position)];

  tree[position] = [
    Math.min(leftValue[0], rightValue[0]),
    Math.max(leftValue[1], rightValue[1])
  ];
  return tree;
};

const findRecursively = (tree, findLeft, findRight, left, right, position) => {
  if (findLeft <= left && findRight >= right) {
    return tree[position];
  }

  if (findLeft > right || findRight < left) {
    return FALLBACK;
  }

  const middle = Math.floor((left + right) / 2);

  const leftValue = findRecursively(
    tree,
    findLeft,
    findRight,
    left,
    middle,
    getLeftChildIndex(position)
  );

  const rightValue = findRecursively(
    tree,
    findLeft,
    findRight,
    middle + 1,
    right,
    getRightChildIndex(position)
  );

  return [
    Math.min(leftValue[0], rightValue[0]),
    Math.max(leftValue[1], rightValue[1])
  ];
};

const create = data => {
  const dataLength = data.length;
  const treeLength = getSegmentTreeLength(dataLength);
  const tree = new Array(treeLength).fill(null);

  return [createRecursively(tree, data, 0, dataLength - 1, 0), data.length];
};

const find = (tree, findLeft, findRight) => {
  return findRecursively(tree[0], findLeft, findRight, 0, tree[1] - 1, 0);
};

module.exports.fallback = FALLBACK;
module.exports.create = create;
module.exports.find = find;
