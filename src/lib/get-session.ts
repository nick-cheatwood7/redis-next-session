import nextsession from 'next-session';
import { RedisStore } from './redis-store';

const sessionStore = new RedisStore();

export const getSession = nextsession({
  store: sessionStore,
  autoCommit: true,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'strict'
  }
});
