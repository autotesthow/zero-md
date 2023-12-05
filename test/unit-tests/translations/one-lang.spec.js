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

   describe('One-lang', () => {
    beforeEach(() => {
      zero.addHtml(`<zero-md manual-render></zero-md>`)
    })
    afterEach(() => {
      zero.remove()
    })

    it('correct work', async () => {
      zero.appendScriptMD(`
<!--uk~{{Variable}}~Змінна~-->
<localized main="uk"/>
 
<p><uk>{{Variable}}</uk></p>`)
     
      await zero.render()

      expect(zero.body$('p').innerText).to.equals('Змінна')
    })

    it('incorrect lang must dont work with other langs', async () => {
      zero.appendScriptMD(`
<!--uk~{{Variable}}~Змінна~-->
<localized main="ru"/>
 
<p><en-ru>{{Variable}}</en-ru></p>`)
     
      await zero.render()

      expect(zero.body$('p').innerText).to.equals('{{Variable}}')
    })
  })
}
