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
  
  describe('Multi-code', () => {
    beforeEach(() => {
      zero.addHtml(`<zero-md manual-render></zero-md>`)
    })
    afterEach(() => {
      zero.remove()
    })
            
    it('correct work with first code', async () => {
      zero.appendScriptMD(`
<!--js-ts~{{Variable}}~Variable~-->
<codalized main="js"/>
 
<p><js>{{Variable}}</js></p>`)
     
      await zero.render()

      expect(zero.body$('p').innerText).to.equals('Variable')
    })
           
    it('correct work with last code', async () => {
      zero.appendScriptMD(`
<!--js-ts~{{Variable}}~Variable~-->
<codalized main="ts"/>

<p><ts>{{Variable}}</ts></p>`)
     
      await zero.render()

      expect(zero.body$('p').innerText).to.equals('Variable')
    })
            
    it('dont work with other code', async () => {
      zero.appendScriptMD(`
<!--js-ts~{{Variable}}~Variable~-->
<codalized main="py"/>

<p><java-py-cs>{{Variable}}</java-py-cs></p>`)
     
      await zero.render()

      expect(zero.body$('p').innerText).to.equals('{{Variable}}')
    })
  })
}
