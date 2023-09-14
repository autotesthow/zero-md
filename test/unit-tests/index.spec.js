/* eslint-env mocha */

import coreTests from './core-tests.spec.js'
import unitTests from './unit-tests.spec.js'
import customTabNamesTests from './custom-tab-names.spec.js'
import attributeTests from './attributes-tests.spec.js'
import tocTests from './toc-tests.spec.js'
import translationsTests from './translations-tests.spec.js'
import localImportTests from './local-import-tests.spec.js'
import onBoardTests from './on-board-tests.spec.js'

coreTests()
unitTests()
customTabNamesTests()
attributeTests()
tocTests()
translationsTests()
localImportTests()
onBoardTests()

mocha.run()