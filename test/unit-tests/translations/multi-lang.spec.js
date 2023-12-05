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

  describe('Multi-lang', () => {
    beforeEach(() => {
      zero.addHtml(`<zero-md manual-render></zero-md>`)
    })
    afterEach(() => {
      zero.remove()
    })
    
    it('correct work with first lang', async () => {
      zero.appendScriptMD(`
<!--en-ru~{{Variable}}~Variable~-->
<localized main="en"/>

<p><en>{{Variable}}</en></p>`)
     
      await zero.render()

      expect(zero.body$('p').innerText).to.equals('Variable')
    })

    it('correct work with last lang', async () => {
      zero.appendScriptMD(`
<!--en-ru~{{toBeTranslated}}~Translation~-->
<localized main="ru"/>
 
<p><ru>{{toBeTranslated}}</ru></p>`)
     
      await zero.render()

      expect(zero.body$('p').innerText).to.equals('Translation')
    })
        
    it('dont work with other lang', async () => {
      zero.appendScriptMD(`
<!--en-ru~{{Variable}}~Variable~-->
<localized main="uk"/>

<p><uk>{{Variable}}</uk></p>`)
     
      await zero.render()

      expect(zero.body$('p').innerText).to.equals('{{Variable}}')
    })
  })
}
