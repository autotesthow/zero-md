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

  describe('General translation', () => {
    beforeEach(() => {
      zero.addHtml(`<zero-md manual-render></zero-md>`)
    })
    afterEach(() => {
      zero.remove()
    })

    it('correct work', async () => {
      zero.appendScriptMD(`
<!--~{{Variable}}~mustBeVisible~-->

<p>{{Variable}}</p>`)
     
      await zero.render()

      expect(zero.body$('p').innerText).to.equals('mustBeVisible')
    })

    it('work correctly with case sensitive', async () => {
      zero.appendScriptMD(`      
<!--~{{Variable}}~mustBeNoVisible~-->
<!--~{{variable}}~mustBeVisible~-->
 
<p>{{variable}}</p>`)
     
      await zero.render()

      expect(zero.body$('p').innerText).to.equals('mustBeVisible')
    })

    it('work correctly in localized tag', async () => {
      zero.appendScriptMdLocalized('en', `
<!--~{{Variable}}~mustBeVisible~-->

<p><en>{{Variable}}</en></p>`)
     
      await zero.render()

      expect(zero.body$('p').innerText).to.equals('mustBeVisible')
    })

    it('work correctly in codalized tag', async () => {
      zero.appendScriptMdCodalized('py', `
<!--~{{Variable}}~mustBeVisible~-->

<p><py>{{Variable}}</py></p>`)
     
      await zero.render()

      expect(zero.body$('p').innerText).to.equals('mustBeVisible')
    })
  })
}
