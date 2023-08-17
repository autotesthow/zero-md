/* eslint-env mocha */

import coreTests from './coreTests.spec.js'
import unitTests from './unit-tests.spec.js'
import customTabNamesTests from './cusom-tab-names.spec.js'
import attributeTests from './attributesTests.spec.js'
import boardTest from './tasks-on-board.spec.js'

// coreTests()
// unitTests()
// customTabNamesTests()
// attributeTests()
boardTest()

mocha.run()