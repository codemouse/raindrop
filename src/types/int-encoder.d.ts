declare module 'int-encoder' {
  const intEncoder: {
    alphabet: string;
    encode(value: string, radix: number): string;
    decode(value: string, radix: number): string;
  };
  export = intEncoder;
}
