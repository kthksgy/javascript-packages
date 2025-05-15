// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface FirestoreModuleAugmentation {}

type FirestoreModule = Omit<
  {
    DateTime: Date;
    Timestamp: Date;
  },
  keyof FirestoreModuleAugmentation
>;

type DateTime = FirestoreModule["DateTime"];
type Timestamp = FirestoreModule["Timestamp"];

/**
 * オブジェクトのプロパティにアクセスする。
 *
 * @param T オブジェクト
 * @param P プロパティのパス(セグメントタプルまたはドット表記)
 */
export type Access<T, P> = P extends "__name__"
  ? string
  : P extends keyof T
    ? [Extract<T[P], DateTime>] extends [never]
      ? T[P]
      : T[P] | Timestamp
    : P extends `${infer K}.${infer R}`
      ? K extends keyof T
        ? Access<NonNullable<Extract<T[K], object>>, R>
        : K extends `${infer I extends number}`
          ? I extends keyof T
            ? Access<T[I], R>
            : never
          : never
      : P extends [infer K, ...infer R]
        ? K extends keyof T
          ? Access<NonNullable<Extract<T[K], object>>, R>
          : never
        : never;

type IsAny<T> = unknown extends T ? ([keyof T] extends [never] ? false : true) : false;

/**
 * オブジェクトのプロパティを再帰的に検索しドット表記で返す。
 *
 * @param T 検索対象のオブジェクト
 * @param ExtraPrimitiveType 追加のプリミティブ型
 *
 * @example
 * ```typescript
 * // 'a' | 'd' | 'e' | 'a.b' | 'a.c' | 'e.{number}'
 * type Example = PropertyNameDotNotation<{ a: { b: string; c: number; }; d: boolean; e: Array<string>; }>;
 */
export type PropertyPathDotNotation<T, ExtraPrimitiveType = never> = Exclude<
  TupleDotNotation<PropertyPathSegmentTuple<T, ExtraPrimitiveType>>,
  symbol
>;

// NOTE: この型によってタプルのユニオンを得てもVSCodeの補完が正しく効かないがエラーは指摘される。
/**
 * オブジェクトのプロパティを再帰的に検索しタプルで返す。
 *
 * @param T 検索対象のオブジェクト
 * @param ExtraPrimitiveType 追加のプリミティブ型
 *
 * @example
 * ```typescript
 * // ['a'] | ['d'] | ['e'] | ['a', 'b'] | ['a', 'c'] | ['e', number]
 * type Example = ObjectKeyTuple<{ a: { b: string; c: number; }; d: boolean; e: Array<string>; }>;
 * ```
 */
export type PropertyPathSegmentTuple<
  T,
  ExtraPrimitiveType = never,
  ParentKeyTuple extends Array<string | number | symbol> = [],
> =
  IsAny<T> extends true
    ? never
    : T extends ExtraPrimitiveType | PrimitiveType
      ? ParentKeyTuple
      : T extends Array<infer E>
        ? E extends ExtraPrimitiveType | PrimitiveType
          ? ParentKeyTuple | [...ParentKeyTuple, number]
          : PropertyPathSegmentTuple<T[number], ExtraPrimitiveType, [...ParentKeyTuple, number]>
        : T extends object
          ?
              | [...ParentKeyTuple, ...UnionTupleUnion<keyof T>]
              | PropertyPathSegmentTupleDistributor<T, ExtraPrimitiveType, ParentKeyTuple>
          : never;

/**
 * `PropertyPathSegmentTuple`の処理を分配する。
 *
 * @example
 * ```typescript
 * // これを使って明示的な分配を行わないと各階層のキーが混ざる。
 * // この場合、存在しないパスを指定してもコンパイラに指摘されない。
 * type Example = ['a' | 'b', 'c' | 'd'];
 * ```
 */
type PropertyPathSegmentTupleDistributor<
  T extends object,
  ExtraPrimitiveType,
  ParentKeyTuple extends Array<string | number | symbol>,
  T1 extends keyof T = keyof T,
  T2 = T1,
> = T1 extends T2
  ? [T1] extends [T2]
    ? PropertyPathSegmentTuple<T[T1], ExtraPrimitiveType, [...ParentKeyTuple, T1]>
    : never
  : never;

/**
 * JavaScriptのプリミティブ型
 */
type PrimitiveType = string | number | bigint | boolean | symbol | null | undefined;

export type SpecialPropertyPath = "__name__";

/**
 * タプルをドット表記に変換する。
 */
type TupleDotNotation<
  T extends Array<string | number | bigint | boolean | symbol | null | undefined>,
> = T extends []
  ? ""
  : T extends [infer F]
    ? F
    : T extends [infer F, ...infer R]
      ? F extends string | number | bigint | boolean | null | undefined
        ? R extends Array<string | number | bigint | boolean | null | undefined>
          ? `${F}.${TupleDotNotation<R>}`
          : `${F}`
        : ""
      : "";

type UnionTupleUnion<T1, T2 = T1> = T1 extends T2 ? ([T1] extends [T2] ? [T1] : never) : never;
