import { Branch } from './Branch.js';
import { DataHasher, IHashAlgorithm } from '../hash/DataHasher.js';
import { BigintConverter } from '../util/BigintConverter.js';
import { dedent } from '../util/StringUtils.js';

export class NodeBranch {
  public constructor(
    public readonly path: bigint,
    public readonly left: Branch,
    public readonly right: Branch,
    private readonly _hash: Uint8Array,
  ) {}

  public get hash(): Uint8Array {
    return new Uint8Array(this._hash);
  }

  public static async create(
    algorithm: IHashAlgorithm,
    path: bigint,
    left: Branch,
    right: Branch,
  ): Promise<NodeBranch> {
    const hash = await new DataHasher(algorithm)
      .update(left?.hash ?? new Uint8Array(1))
      .update(right?.hash ?? new Uint8Array(1))
      .digest();

    return new NodeBranch(
      path,
      left,
      right,
      await new DataHasher(algorithm).update(BigintConverter.encode(path)).update(hash).digest(),
    );
  }

  public toString(): string {
    return dedent`
      Branch[${this.path.toString(2)}]
        Left: 
          ${this.left?.toString()}
        Right: 
          ${this.right?.toString()}`;
  }
}
