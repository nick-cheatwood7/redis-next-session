import nextsession from 'next-session';
import signature from 'cookie-signature';
import { RedisStore } from './redis-store';

const sessionStore = new RedisStore();
const secret = 'wG00tWlrYOWHy4+SKsPbmJMlEvticSAbkBWYYbtmG5g=';

export const getSession = nextsession({
  store: sessionStore,
  autoCommit: true,
  encode: (sid) => (sid ? 's:' + signature.sign(sid, secret) : ''),
  decode: (sid) => signature.unsign(sid.slice(2), secret) || '',
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'strict'
  }
});
