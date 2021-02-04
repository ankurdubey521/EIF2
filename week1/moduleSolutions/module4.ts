import keccak256 from "keccak256";
import { MerkleTree } from "merkletreejs";

import { getBlockDataByNumber, getWalletAndProvider } from "../utils/utils";

interface hashInterface<T, U> {
  (data: T): U;
}
interface combineInterface<T> {
  (left: T, right: T): T;
}

let getBlockHashes = async (
  leftIndex: number,
  rightIndex: number
): Promise<string[]> => {
  await getWalletAndProvider();
  console.log("Loading blocks for the first time...");
  const blockValues = await Promise.all(
    new Array(rightIndex - leftIndex + 1)
      .fill(0)
      .map((value: number, index: number) =>
        getBlockDataByNumber(leftIndex + index)
      )
  );
  return blockValues.map((x) => x.hash);
};

const hash: hashInterface<Buffer, Buffer> = (data: Buffer): Buffer =>
  keccak256(data);

const merkleTree = (
  leaves: Buffer[],
  hash: hashInterface<Buffer, Buffer>
): Buffer[][] => {
  const treeLevels = [leaves];
  while (treeLevels[treeLevels.length - 1].length != 1) {
    const nextLevel: Buffer[] = [],
      currentLevel = treeLevels[treeLevels.length - 1];
    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i === currentLevel.length - 1) {
        nextLevel.push(currentLevel[i]);
      } else
        nextLevel.push(
          hash(Buffer.concat([currentLevel[i], currentLevel[i + 1]]))
        );
    }
    treeLevels.push(nextLevel);
  }
  return treeLevels;
};

const module4 = async () => {
  const data = await getBlockHashes(0, 127);
  const leaves: Buffer[] = data.map(keccak256);
  const tree = merkleTree(leaves, hash);
  const rootHash = tree[tree.length - 1][0].toString("hex");
  console.log(`Root Hash is ${rootHash} from custom merkle tree`);

  const libTree = new MerkleTree(leaves, keccak256);
  const root = libTree.getRoot().toString("hex");
  console.log(`Root Hash is ${root} from library merkle tree`);
};

export default module4;