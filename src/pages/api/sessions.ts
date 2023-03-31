import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '../../lib/get-session';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession(req, res);
  res.status(200).json(session);
}

export const config = {
  api: {
    externalResolver: true
  }
};
