import type { IsAny } from "./is-any";

({}) as IsAny<any> satisfies true;

({}) as IsAny<string> satisfies false;
({}) as IsAny<number> satisfies false;
({}) as IsAny<boolean> satisfies false;
({}) as IsAny<symbol> satisfies false;
({}) as IsAny<object> satisfies false;
({}) as IsAny<null> satisfies false;
({}) as IsAny<undefined> satisfies false;
({}) as IsAny<{ (): void }> satisfies false;
({}) as IsAny<Array<string>> satisfies false;
({}) as IsAny<Record<string, string>> satisfies false;
({}) as IsAny<unknown> satisfies false;
