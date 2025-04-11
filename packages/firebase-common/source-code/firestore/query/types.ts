import { StandardSchemaV1 } from "@standard-schema/spec";
import { Temporal } from "temporal-polyfill";

import {
  Access,
  PropertyPathDotNotation,
  PropertyPathSegmentTuple,
  SpecialPropertyPath,
} from "../types";

export type DocumentDataSchema = StandardSchemaV1<Partial<Record<string, unknown>>>;
export type DocumentData<Schema extends DocumentDataSchema> = StandardSchemaV1.InferOutput<Schema>;
export type ExtraPrimitiveType = Temporal.ZonedDateTime;
export type NoSymbol<T> = T extends symbol
  ? never
  : T extends ReadonlyArray<any>
    ? T[number] extends symbol
      ? never
      : T
    : T;
export type Value<T extends object, P> = Exclude<Access<T, P>, undefined>;
export type Path<T = null> = T extends object
  ? NoSymbol<
      | SpecialPropertyPath
      | PropertyPathDotNotation<T, ExtraPrimitiveType>
      | PropertyPathSegmentTuple<T, ExtraPrimitiveType>
    >
  : string | number | ReadonlyArray<string | number>;
