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

  describe('Not-lang', () => {
    beforeEach(() => {
      zero.addHtml(`<zero-md manual-render></zero-md>`)
    })
    afterEach(() => {
      zero.remove()
    })

    it('lang by main attribute in localized option <not-en>', async () => {
      zero.appendScriptMD(`
<localized main="uk"/>

<not-en>NOT-EN</not-en>`)
      await zero.render()
   
      expect(zero.body$('localized').innerText).to.equal('NOT-EN')
    })

    it('lang by main attribute in localized option <not-uk-ru>', async () => {
      zero.appendScriptMD(`
<localized main="en"/>

<not-uk-ru>NOT-UK-RU</not-uk-ru>`)
      await zero.render()
   
      expect(zero.body$('localized').innerText).to.equal('NOT-UK-RU')
    })
    
    it('NO render lang by main attribute in localized option <not-en>', async () => {
      zero.appendScriptMD(`
<localized main="en"/>

<not-en>NOT-EN</not-en>`)
      await zero.render()
   
      expect(zero.body$('localized p')).to.not.exist
    })

    it('NO render lang by main attribute in localized option <not-uk-ru>', async () => {
      zero.appendScriptMD(`
<localized main="ru"/>

<not-uk-ru>NOT-UK-RU</not-uk-ru>`)
      await zero.render()
   
      expect(zero.body$('localized p')).to.not.exist
    }) 
  })
}
