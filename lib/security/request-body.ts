export class JsonBodyError extends Error {
  constructor(
    message: string,
    public readonly status: 400 | 413,
  ) {
    super(message);
    this.name = 'JsonBodyError';
  }
}

export async function readJsonBody(request: Request, maxBytes: number): Promise<unknown> {
  const contentType = request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase();
  if (contentType !== 'application/json') {
    throw new JsonBodyError('Le corps de la requête doit être au format JSON.', 400);
  }

  const contentLength = request.headers.get('content-length');
  if (contentLength !== null) {
    if (!/^\d+$/.test(contentLength)) {
      throw new JsonBodyError('Taille de requête invalide.', 400);
    }
    if (Number(contentLength) > maxBytes) {
      throw new JsonBodyError('La requête est trop volumineuse.', 413);
    }
  }

  if (!request.body) {
    throw new JsonBodyError('Corps JSON manquant ou invalide.', 400);
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new JsonBodyError('La requête est trop volumineuse.', 413);
      }
      chunks.push(value);
    }
  } catch (error) {
    if (error instanceof JsonBodyError) throw error;
    throw new JsonBodyError('Corps JSON manquant ou invalide.', 400);
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
  } catch {
    throw new JsonBodyError('Corps JSON manquant ou invalide.', 400);
  }
}

export function isJsonRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
