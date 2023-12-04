/* eslint-env mocha */
/* global chai */

import common from './../../utils/common.js'

export default function() {
  mocha.setup({
    ui: 'bdd'
  })

  chai.config.truncateThreshold = 0
  const expect = chai.expect

   describe('Not-lang', () => {
    let zero
    beforeEach(() => {
      zero = common.addHtml(`<zero-md manual-render></zero-md>`)
    })
    afterEach(() => {
      zero.remove()
    })
    
    const zero$ = (selector) => zero.shadowRoot.querySelector(selector)
    const zeroBody = () => zero$('.markdown-body')
    const zeroBody$ = (selector) => zeroBody().querySelector(selector)

    const zeroAppendScriptMD = (text) => {
      const script = document.createElement('script')
      script.setAttribute('type', 'text/markdown')
      script.text = text
      zero.appendChild(script)
    }

    it('lang by main attribute in localized option <not-en>', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>

<not-en>NOT-EN</not-en>`)
      await zero.render()
   
      expect(zeroBody$('localized').innerText).to.equal('NOT-EN')
    })

    it('lang by main attribute in localized option <not-uk-ru>', async () => {
      zeroAppendScriptMD(`
<localized main="en"/>

<not-uk-ru>NOT-UK-RU</not-uk-ru>`)
      await zero.render()
   
      expect(zeroBody$('localized').innerText).to.equal('NOT-UK-RU')
    })
    
    it('NO render lang by main attribute in localized option <not-en>', async () => {
      zeroAppendScriptMD(`
<localized main="en"/>

<not-en>NOT-EN</not-en>`)
      await zero.render()
   
      expect(zeroBody$('localized p')).to.not.exist
    })

    it('NO render lang by main attribute in localized option <not-uk-ru>', async () => {
      zeroAppendScriptMD(`
<localized main="ru"/>

<not-uk-ru>NOT-UK-RU</not-uk-ru>`)
      await zero.render()
   
      expect(zeroBody$('localized p')).to.not.exist
    }) 
  })
}
