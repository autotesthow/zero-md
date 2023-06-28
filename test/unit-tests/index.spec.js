/* eslint-env mocha */

import unitTests from './unit-tests.spec.js'
import systemTests from './systemTests.spec.js'
import customTabNamesTests from './cusom-tab-names.spec.js'
import attributeTests from './attributesTests.spec.js'

// unitTests()
// systemTests()
// customTabNamesTests()
attributeTests()


mocha.run()