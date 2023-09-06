/* eslint-env mocha */

import coreTests from './coreTests.spec.js'
import unitTests from './unit-tests.spec.js'
import customTabNamesTests from './custom-tab-names.spec.js'
import attributeTests from './attributesTests.spec.js'
import onBoardTests from './onBoardTests.spec.js'

coreTests()
unitTests()
customTabNamesTests()
attributeTests()
onBoardTests()

mocha.run()