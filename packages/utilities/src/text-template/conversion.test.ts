import { describe, expect, test } from 'vitest';

import { convertPathTemplateIntoStringTemplate } from './conversion';

describe(`${convertPathTemplateIntoStringTemplate.name}()`, () => {
  const cases: Array<[string, string, string, string]> = [
    ['', '$', '', ''],
    ['a', '$', '', 'a'],
    ['aa', '$', '', 'aa'],
    ['$a', '$', '', '%a%'],
    ['a/b', '$', '', 'a/b'],
    ['a/$b', '$', '', 'a/%b%'],
    ['$a/b', '$', '', '%a%/b'],
    ['$a/$b', '$', '', '%a%/%b%'],
    ['a/b/c', '$', '', 'a/b/c'],
    ['$a/b/c', '$', '', '%a%/b/c'],
    ['a/$b/c', '$', '', 'a/%b%/c'],
    ['a/b/$c', '$', '', 'a/b/%c%'],
    ['$a/$b/c', '$', '', '%a%/%b%/c'],
    ['a/$b/$c', '$', '', 'a/%b%/%c%'],
    ['$a/b/$c', '$', '', '%a%/b/%c%'],
    ['$a/$b/$c', '$', '', '%a%/%b%/%c%'],
    ['', ':', ':', ''],
    ['a', ':', ':', 'a'],
    [':a', ':', ':', ':a'],
    ['a:', ':', ':', 'a:'],
    [':a:', ':', ':', '%a%'],
    ['a/:b', ':', ':', 'a/:b'],
    ['a/b:', ':', ':', 'a/b:'],
    ['a/:b:', ':', ':', 'a/%b%'],
    [':a/b', ':', ':', ':a/b'],
    ['a:/b', ':', ':', 'a:/b'],
    [':a:/b', ':', ':', '%a%/b'],
    ['a/:b:/c', ':', ':', 'a/%b%/c'],
  ];

  test.each(cases)(
    `${convertPathTemplateIntoStringTemplate.name}('%s', '%s', '%s') === '%s'`,
    function (template, keyPrefix, keySuffix, output) {
      expect(convertPathTemplateIntoStringTemplate(template, keyPrefix, keySuffix)).toBe(output);
    },
  );

  test.each(cases)(
    `${convertPathTemplateIntoStringTemplate.name}('/%s', '%s', '%s') === '/%s'`,
    function (template, keyPrefix, keySuffix, output) {
      expect(convertPathTemplateIntoStringTemplate('/' + template, keyPrefix, keySuffix)).toBe(
        '/' + output,
      );
    },
  );

  test.each(cases)(
    `${convertPathTemplateIntoStringTemplate.name}('%s/', '%s', '%s') === '%s/'`,
    function (template, keyPrefix, keySuffix, output) {
      expect(convertPathTemplateIntoStringTemplate(template + '/', keyPrefix, keySuffix)).toBe(
        output + '/',
      );
    },
  );
});
