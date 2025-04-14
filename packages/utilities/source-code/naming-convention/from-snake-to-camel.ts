/**
 * スネークケースをキャメルケースに変換する。
 * @param snake 次に示すケースの文字列
 * - スネークケース (`snake_case`)
 * - スクリーミングスネークケース (`SCREAMING_SNAKE_CASE`)
 * - キャメルスネークケース (`Camel_Snake_Case`)
 * @returns キャメルケースの文字列
 * - `snakeCase`
 * - `screamingSnakeCase`
 * - `camelSnakeCase`
 */
export function fromSnakeToCamel(snake: string) {
  return snake.toLowerCase().replace(/_\w/g, replacer);
}

function replacer(substring: string, ..._: any[]) {
  return substring[1].toUpperCase();
}
