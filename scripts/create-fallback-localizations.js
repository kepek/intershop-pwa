const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const createFallbackLocalizations = (localizationFiles_lang, localizationsFoundOrdered) => {
  const fallbackLocalizations = localizationFiles_lang.reduce((acc, file) => {
    acc[file] = {};
    return acc;
  }, {});

  localizationFiles_lang.forEach(file => {
    const prefixValue = (v) => {
      const langCode = path.parse(file).name;
      return `(${langCode})_${v}`
    }
    const mapFallbackValue = (v) => {
      return _.isObject(v) ? _.mapValues(v, prefixValue) : prefixValue(v);
    }
    const localizations_lang = JSON.parse(fs.readFileSync(file, 'utf8'));
    // find missing localization keys
    _.difference(Object.keys(localizationsFoundOrdered), Object.keys(localizations_lang)).forEach(key => {
      fallbackLocalizations[file][key] = mapFallbackValue(localizationsFoundOrdered[key])
    });
  });

  localizationFiles_lang
    .filter(file => Object.keys(fallbackLocalizations[file]).length)
    .forEach(file => {
      const localizations_lang = JSON.parse(fs.readFileSync(file, 'utf8'));
      const localizations_lang_with_fallbacks = { ...localizations_lang, ...fallbackLocalizations?.[file] };
      const localizations_lang_with_fallbacks_ordered = {};

      Object.keys(localizations_lang_with_fallbacks)
        .sort()
        .forEach(key => {
          localizations_lang_with_fallbacks_ordered[key] = localizations_lang_with_fallbacks[key];
        });

      console.log('\n' + `Adding fallback localizations in ${file}`);

      fs.writeFileSync(file, JSON.stringify(localizations_lang_with_fallbacks_ordered, null, 2));
    });
};

module.exports = { createFallbackLocalizations: createFallbackLocalizations };
