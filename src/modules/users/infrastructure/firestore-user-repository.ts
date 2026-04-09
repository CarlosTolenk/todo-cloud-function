import type { Firestore } from 'firebase-admin/firestore';

import type { CreateUserInput, User } from '../domain/user';
import type { UserRepository } from '../domain/user-repository';

interface UserDocument {
  email: string;
  createdAt: string;
}

const USERS_COLLECTION = 'users';

export class FirestoreUserRepository implements UserRepository {
  constructor(private readonly firestore: Firestore) {}

  async findByEmail(email: string): Promise<User | null> {
    const snapshot = await this.firestore
      .collection(USERS_COLLECTION)
      .where('email', '==', email)
      .limit(1)
      .get();

    const document = snapshot.docs[0];

    if (!document) {
      return null;
    }

    return {
      id: document.id,
      ...(document.data() as UserDocument),
    };
  }

  async findById(id: string): Promise<User | null> {
    const document = await this.firestore.collection(USERS_COLLECTION).doc(id).get();

    if (!document.exists) {
      return null;
    }

    return {
      id: document.id,
      ...(document.data() as UserDocument),
    };
  }

  async create(input: CreateUserInput): Promise<User> {
    const reference = this.firestore.collection(USERS_COLLECTION).doc();
    const user: User = {
      id: reference.id,
      email: input.email,
      createdAt: new Date().toISOString(),
    };

    await reference.set({
      email: user.email,
      createdAt: user.createdAt,
    });

    return user;
  }
}
