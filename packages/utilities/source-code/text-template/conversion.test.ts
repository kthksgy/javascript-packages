import { describe, expect, test } from "vitest";

import { fromPathPatternToTextTemplate } from "./conversion";

describe(`${fromPathPatternToTextTemplate.name}()`, () => {
  const cases: Array<[string, string, string, string]> = [
    ["", "$", "", ""],
    ["a", "$", "", "a"],
    ["aa", "$", "", "aa"],
    ["$a", "$", "", "{a}"],
    ["a/b", "$", "", "a/b"],
    ["a/$b", "$", "", "a/{b}"],
    ["$a/b", "$", "", "{a}/b"],
    ["$a/$b", "$", "", "{a}/{b}"],
    ["a/b/c", "$", "", "a/b/c"],
    ["$a/b/c", "$", "", "{a}/b/c"],
    ["a/$b/c", "$", "", "a/{b}/c"],
    ["a/b/$c", "$", "", "a/b/{c}"],
    ["$a/$b/c", "$", "", "{a}/{b}/c"],
    ["a/$b/$c", "$", "", "a/{b}/{c}"],
    ["$a/b/$c", "$", "", "{a}/b/{c}"],
    ["$a/$b/$c", "$", "", "{a}/{b}/{c}"],
    ["", ":", ":", ""],
    ["a", ":", ":", "a"],
    [":a", ":", ":", ":a"],
    ["a:", ":", ":", "a:"],
    [":a:", ":", ":", "{a}"],
    ["a/:b", ":", ":", "a/:b"],
    ["a/b:", ":", ":", "a/b:"],
    ["a/:b:", ":", ":", "a/{b}"],
    [":a/b", ":", ":", ":a/b"],
    ["a:/b", ":", ":", "a:/b"],
    [":a:/b", ":", ":", "{a}/b"],
    ["a/:b:/c", ":", ":", "a/{b}/c"],
  ];

  test.each(cases)(
    `${fromPathPatternToTextTemplate.name}('%s', '%s', '%s') === '%s'`,
    function (template, keyPrefix, keySuffix, output) {
      expect(fromPathPatternToTextTemplate(template, keyPrefix, keySuffix)).toBe(output);
    },
  );

  test.each(cases)(
    `${fromPathPatternToTextTemplate.name}('/%s', '%s', '%s') === '/%s'`,
    function (template, keyPrefix, keySuffix, output) {
      expect(fromPathPatternToTextTemplate("/" + template, keyPrefix, keySuffix)).toBe(
        "/" + output,
      );
    },
  );

  test.each(cases)(
    `${fromPathPatternToTextTemplate.name}('%s/', '%s', '%s') === '%s/'`,
    function (template, keyPrefix, keySuffix, output) {
      expect(fromPathPatternToTextTemplate(template + "/", keyPrefix, keySuffix)).toBe(
        output + "/",
      );
    },
  );
});
