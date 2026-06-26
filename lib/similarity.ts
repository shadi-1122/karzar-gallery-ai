export function dotProduct(a: number[], b: number[]) {
  let sum = 0;

  for (let i = 0; i < a.length; i++) {
    sum += a[i] * b[i];
  }

  return sum;
}

export function magnitude(vector: number[]) {
  let sum = 0;

  for (const value of vector) {
    sum += value * value;
  }

  return Math.sqrt(sum);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Embedding dimensions do not match.");
  }

  const denominator = magnitude(a) * magnitude(b);

  if (denominator === 0) {
    return 0;
  }

  return dotProduct(a, b) / denominator;
}

export function isValidEmbedding(embedding: unknown): embedding is number[] {
  return (
    Array.isArray(embedding) &&
    embedding.length > 0 &&
    embedding.every((value) => typeof value === "number")
  );
}
