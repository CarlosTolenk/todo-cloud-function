type DocumentData = Record<string, unknown>;

class FakeDocumentSnapshot {
  constructor(
    public readonly id: string,
    private readonly snapshotData: DocumentData | undefined,
  ) {}

  get exists(): boolean {
    return this.snapshotData !== undefined;
  }

  data(): DocumentData | undefined {
    return this.snapshotData;
  }
}

class FakeQuerySnapshot {
  constructor(public readonly docs: FakeDocumentSnapshot[]) {}
}

class FakeDocumentReference {
  constructor(
    public readonly id: string,
    private readonly store: Map<string, DocumentData>,
  ) {}

  async get(): Promise<FakeDocumentSnapshot> {
    return new FakeDocumentSnapshot(this.id, this.store.get(this.id));
  }

  async set(data: DocumentData): Promise<void> {
    this.store.set(this.id, data);
  }

  async update(data: DocumentData): Promise<void> {
    const current = this.store.get(this.id);

    if (!current) {
      throw new Error(`Document ${this.id} does not exist`);
    }

    this.store.set(this.id, {
      ...current,
      ...data,
    });
  }

  async delete(): Promise<void> {
    this.store.delete(this.id);
  }
}

class FakeCollectionReference {
  private currentFilterField?: string;
  private currentFilterValue?: unknown;
  private currentOrderField?: string;
  private currentOrderDirection: 'asc' | 'desc' = 'asc';
  private currentLimit?: number;

  constructor(
    private readonly store: Map<string, DocumentData>,
    private readonly idFactory: () => string,
  ) {}

  doc(id?: string): FakeDocumentReference {
    return new FakeDocumentReference(id ?? this.idFactory(), this.store);
  }

  where(field: string, _operator: '==', value: unknown): FakeCollectionReference {
    this.currentFilterField = field;
    this.currentFilterValue = value;
    return this;
  }

  orderBy(
    field: string,
    direction: 'asc' | 'desc' = 'asc',
  ): FakeCollectionReference {
    this.currentOrderField = field;
    this.currentOrderDirection = direction;
    return this;
  }

  limit(value: number): FakeCollectionReference {
    this.currentLimit = value;
    return this;
  }

  async get(): Promise<FakeQuerySnapshot> {
    let entries = [...this.store.entries()];

    if (this.currentFilterField !== undefined) {
      entries = entries.filter(
        ([, data]) => data[this.currentFilterField!] === this.currentFilterValue,
      );
    }

    if (this.currentOrderField !== undefined) {
      entries.sort((left, right) => {
        const leftValue = String(left[1][this.currentOrderField!]);
        const rightValue = String(right[1][this.currentOrderField!]);
        return this.currentOrderDirection === 'desc'
          ? rightValue.localeCompare(leftValue)
          : leftValue.localeCompare(rightValue);
      });
    }

    if (this.currentLimit !== undefined) {
      entries = entries.slice(0, this.currentLimit);
    }

    return new FakeQuerySnapshot(
      entries.map(([id, data]) => new FakeDocumentSnapshot(id, data)),
    );
  }
}

export class FakeFirestore {
  private readonly collections = new Map<string, Map<string, DocumentData>>();
  private idCounter = 0;

  collection(name: string): FakeCollectionReference {
    const store = this.collections.get(name) ?? new Map<string, DocumentData>();
    this.collections.set(name, store);

    return new FakeCollectionReference(store, () => {
      this.idCounter += 1;
      return `${name}-${this.idCounter}`;
    });
  }

  seed(collectionName: string, id: string, data: DocumentData): void {
    const collection = this.collections.get(collectionName) ?? new Map<string, DocumentData>();
    collection.set(id, data);
    this.collections.set(collectionName, collection);
  }
}
