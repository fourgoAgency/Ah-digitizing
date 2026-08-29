import { handleCustomLogin } from '../_shared';

export async function POST(req: Request) {
  return handleCustomLogin(req);
}
