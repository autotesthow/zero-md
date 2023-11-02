/* eslint-env mocha */

import coreTests from './core-tests.spec.js'
import customTabNamesTests from './custom-tab-names.spec.js'
import localizationCodalizationRendering from './localization-codalization-render.spec.js'
import tocTests from './toc-tests.spec.js'
import translationsTests from './translations-tests.spec.js'
import localImportTests from './local-import-tests.spec.js'
import inlineMultilineLocalizationCodalization from './inline-multiline-localization-codalization.spec.js'
import codeblocksAndCodegroupsTests from './codeblocks-and-codegroups-tests.spec.js'

coreTests()
inlineMultilineLocalizationCodalization()
customTabNamesTests()
localizationCodalizationRendering()
tocTests()
translationsTests()
localImportTests()
codeblocksAndCodegroupsTests()

mocha.run()