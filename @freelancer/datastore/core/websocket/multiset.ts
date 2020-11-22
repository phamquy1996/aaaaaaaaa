/* An implementation of a multiset.
 * Heavily modified from the npm package cell-multiset.
 */

// An interface that covers T[] and Set<T>
interface Collection<T> {
  forEach(callbackfn: (value: T) => void): void;
}

export class MultiSet<T> {
  private elements: Map<T, number>;

  constructor(elms?: Collection<T>) {
    this.elements = new Map();

    if (elms) {
      elms.forEach(elm => this.add(elm));
    }

    return this;
  }

  public add(...elms: T[]) {
    return this.addCollection(elms);
  }

  public addCollection(elms: Collection<T>) {
    elms.forEach(elm => {
      this.elements.set(elm, (this.elements.get(elm) || 0) + 1);
    });

    return this;
  }

  public get cardinality() {
    let len = 0;

    this.elements.forEach(multiplicity => (len += multiplicity));

    return len;
  }

  public clear() {
    this.elements.clear();
    return this;
  }

  public contains(multiset: MultiSet<T>) {
    let found = true;
    multiset.elements.forEach((multiplicity, elm) => {
      if (multiplicity > this.multiplicity(elm)) {
        found = false;
      }
    });

    return found;
  }

  public difference(multiset: MultiSet<T>) {
    this.elements.forEach((multiplicity, elm) => {
      const nmul = multiplicity - multiset.multiplicity(elm);

      if (nmul <= 0) {
        this.elements.delete(elm);
      } else {
        this.elements.set(elm, nmul);
      }
    });

    return this;
  }

  public Difference(multiset: MultiSet<T>): MultiSet<T> {
    const output = new MultiSet<T>();
    this.elements.forEach((multiplicity, elm) => {
      const nmul = multiplicity - multiset.multiplicity(elm);

      if (nmul > 0) {
        output.elements.set(elm, nmul);
      }
    });

    return output;
  }

  public each(callback: (mul: number, elm: T) => boolean, ctx?: any) {
    let all = true;
    this.elements.forEach((mul, elm) => {
      if (!callback.call(ctx, mul, elm)) {
        all = false;
      }
    });

    return all;
  }

  public entries() {
    return this.elements.entries();
  }

  public equals(multiset: MultiSet<T>) {
    return multiset.each((mul, elm) => mul !== this.multiplicity(elm));
  }

  public has(elm: T) {
    return !!this.elements.get(elm);
  }

  public isEmpty(): boolean {
    return !!this.elements.size;
  }

  public intersection(multiset: MultiSet<T>) {
    let nmul;

    this.elements.forEach((multiplicity, elm) => {
      nmul = Math.min(multiplicity, multiset.multiplicity(elm));

      if (!nmul) {
        this.elements.delete(elm);
      } else {
        this.elements.set(elm, nmul);
      }
    });

    return this;
  }

  public Intersection(multiset: MultiSet<T>): MultiSet<T> {
    const output = new MultiSet<T>();
    let nmul;

    this.elements.forEach((multiplicity, elm) => {
      nmul = Math.min(multiplicity, multiset.multiplicity(elm));

      if (nmul) {
        output.elements.set(elm, nmul);
      }
    });

    return output;
  }

  public isSubsetOf(multiset: MultiSet<T>) {
    return multiset.contains(this);
  }

  public keys() {
    return this.elements.keys();
  }

  public multiplicity(elm: T) {
    return this.elements.get(elm) || 0;
  }

  public remove(...elms: T[]) {
    return this.removeCollection(elms);
  }

  public removeCollection(elms: Collection<T>) {
    elms.forEach(elm => {
      const multiplicity = this.elements.get(elm) || 0;

      if (multiplicity === 1) {
        this.elements.delete(elm);
      } else {
        this.elements.set(elm, Math.max(0, multiplicity - 1));
      }
    });

    return this;
  }

  public symmetricDifference(multiset: MultiSet<T>) {
    multiset.elements.forEach((multiplicity, elm) => {
      const diff = this.multiplicity(elm) - multiplicity;

      if (!diff) {
        this.elements.delete(elm);
      } else {
        this.elements.set(elm, Math.abs(diff));
      }
    });

    return this;
  }

  public union(multiset: MultiSet<T>) {
    multiset.elements.forEach((multiplicity, elm) =>
      this.elements.set(elm, Math.max(multiplicity, this.multiplicity(elm))),
    );

    return this;
  }

  public values() {
    return Array.from(this.elements.keys());
  }
}
