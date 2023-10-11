/* eslint-env mocha */

import coreTests from './core-tests.spec.js'
import customTabNamesTests from './custom-tab-names.spec.js'
import attributeTests from './attributes-tests.spec.js'
import tocTests from './toc-tests.spec.js'
import translationsTests from './translations-tests.spec.js'
import localImportTests from './local-import-tests.spec.js'
import localizationsTests from './localizations-tests.spec.js'

coreTests()
localizationsTests()
customTabNamesTests()
attributeTests()
tocTests()
translationsTests()
localImportTests()

mocha.run()