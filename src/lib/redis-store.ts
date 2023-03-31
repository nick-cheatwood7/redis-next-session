import type { SessionStore } from 'next-session';
import { SessionData, SessionRecord } from 'next-session/lib/types';
import { Redis } from 'ioredis';
import { redis } from './redis';

const getSessionId = (sid: string) => `sess:${sid}`;

/**
 * @see https://github.com/hoangvvo/next-session/blob/master/src/memory-store.ts
 */
export class RedisStore implements SessionStore {
  private store: Redis;

  constructor() {
    this.store = redis;
  }

  async get(
    sid: string
  ): Promise<SessionData<SessionRecord> | null | undefined> {
    const sess = await this.store.get(getSessionId(sid));
    if (sess) {
      const session = JSON.parse(sess, (key, value) => {
        if (key === 'expires') return new Date(value);
        return value;
      }) as SessionData;
      if (
        session.cookie.expires &&
        session.cookie.expires.getTime() <= Date.now()
      ) {
        await this.destroy(sid);
        return null;
      }
      return session;
    }
    return null;
  }

  async set(sid: string, session: SessionData<SessionRecord>): Promise<void> {
    this.store.set(
      getSessionId(sid),
      JSON.stringify(session)
    ) as unknown as Promise<void>;
  }

  async destroy(sid: string): Promise<void> {
    this.store.del(getSessionId(sid)) as unknown as Promise<void>;
  }

  async touch(sid: string, sess: SessionData): Promise<void> {
    this.store.set(getSessionId(sid), JSON.stringify(sess));
  }
}
