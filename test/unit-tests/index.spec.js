/* eslint-env mocha */

import coreTests from './core-tests.spec.js'
import customTabNamesTests from './custom-tab-names.spec.js'
import localImportTests from './local-import.spec.js'
import longBreaksTests from './long-breaks.spec.js'
import poetryTests from './poetry.spec.js'
import tocRenderingInNestedTagsTests from './toc/rendering-in-nested-tags.spec.js'
import tocRenderingSimpleScenariosTests from './toc/rendering-simple-scenarios.spec.js'
import tocRenderingWithLocalizedCodalizedTagsTests from './toc/rendering-with-localized-codalized-tags.spec.js'
import localizationCodalizationCodalizationRendersTests from './localization-codalization/codalization-renders.spec.js'
import localizationCodalizationInlineMultilineTests from './localization-codalization/inline-multiline.spec.js'
import localizationCodalizationLocalizationRendersTests from './localization-codalization/localization-renders.spec.js'
import localizationCodalizationRendersWithSearchparamsTests from './localization-codalization/renders-with-searchparams.spec.js'
import localizationCodalizationWithCodegroupsTests from './localization-codalization/with-codegroups.spec.js'
import translationsAlignTranslationsTests from './translations/align-translations.spec.js'
import translationsGeneralTests from './translations/general.spec.js'
import translationsMultiCodeTests from './translations/multi-code.spec.js'
import translationsMultiLangTests from './translations/multi-lang.spec.js'
import translationsOneCodeTests from './translations/one-code.spec.js'
import translationsOneLangTests from './translations/one-lang.spec.js'


coreTests()
customTabNamesTests()
localImportTests()
longBreaksTests()
poetryTests()
tocRenderingInNestedTagsTests()
tocRenderingSimpleScenariosTests()
tocRenderingWithLocalizedCodalizedTagsTests()
localizationCodalizationCodalizationRendersTests()
localizationCodalizationInlineMultilineTests()
localizationCodalizationLocalizationRendersTests() 
localizationCodalizationRendersWithSearchparamsTests() 
localizationCodalizationWithCodegroupsTests()
translationsAlignTranslationsTests()
translationsGeneralTests()
translationsMultiCodeTests()
translationsMultiLangTests()
translationsOneCodeTests()
translationsOneLangTests()

mocha.run()