/* eslint-env mocha */
/* global chai */

import { Zero } from '../../utils/Zero.js'

export default function() {
  mocha.setup({
    ui: 'bdd'
  })

  chai.config.truncateThreshold = 0
  const expect = chai.expect

  const zero = new Zero()

  describe('Nested translation', () => {
    beforeEach(() => {
      zero.addHtml(`<zero-md manual-render></zero-md>`)
    })
    afterEach(() => {
      zero.remove()
    })

    it('correct work', async () => {
      zero.appendScriptMD(`
<!--~{{NestedVariable}}~Nested~-->
<!--~{{Variable}}~{{NestedVariable}} display~-->

<p>{{Variable}}</p>`)
     
      await zero.render()

      expect(zero.body$('p').innerText).to.equals('Nested display')
    })

    //TODO when bag fixed it must path
    it.skip('correct work with codalized one tag', async () => {
      zero.appendScriptMdCodalized('java', `
<!--java~{{NestedVariable}}~NestedJava~-->
<!--java~{{Variable}}~{{NestedVariable}} display~-->

<p><java>{{Variable}}</java></p>`)
     
      await zero.render()

      expect(zero.body$('p').innerText).to.equals('NestedJava display')
    })

    //TODO when bag fixed it must path
    it.skip('correct work with codalized some tags', async () => {
      zero.appendScriptMdCodalized('java', `
<!--java-js~{{NestedVariable}}~NestedJavaJS~-->
<!--java~{{Variable}}~{{NestedVariable}} display~-->

<p><java>{{Variable}}</java></p>`)
     
      await zero.render()

      expect(zero.body$('p').innerText).to.equals('NestedJavaJS display')
    })
  })
}
