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

  describe('One-code', () => {
    beforeEach(() => {
      zero.addHtml(`<zero-md manual-render></zero-md>`)
    })
    afterEach(() => {
      zero.remove()
    })

    it('correct work', async () => {
      zero.appendScriptMD(`
<!--java~{{Variable}}~Java~-->
<codalized main="java"/>

<p><java>{{Variable}}</java></p>`)
     
      await zero.render()

      expect(zero.body$('p').innerText).to.equals('Java')
    })

    it('incorrect code must dont work with other codes', async () => {
      zero.appendScriptMD(`
<!--java~{{Variable}}~Java~-->
<codalized main="js"/>

<p><js-ts-py-cs>{{Variable}}</js-ts-py-cs></p>`)
     
      await zero.render()

      expect(zero.body$('p').innerText).to.equals('{{Variable}}')
    })
  })
}
