/* eslint-env mocha */
/* global chai */

import common from '../utils/common.js'

export default function() {
  mocha.setup({
    ui: 'bdd'
  })

  chai.config.truncateThreshold = 0
  const expect = chai.expect

  describe('Md-links', () => {
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
    const zeroBody$$ = (selector) => zeroBody().querySelectorAll(selector)

    const zeroAppendScriptMD = (text) => {
      const script = document.createElement('script')
      script.setAttribute('type', 'text/markdown')
      script.text = text
      zero.appendChild(script)
    }

    it('with http and https should render as external links with .md', async () => {
      zeroAppendScriptMD(`
<localized main="ru"/>

(https://github.com/yashaka/NSelene/blob/master/variant_1.md)

(http://github.com/yashaka/NSelene/blob/master/variant_2.md)

(http://github.com/yashaka/NSelene/blob/master/variant_3.md#some_tag)
`)

      await zero.render()
      expect(zeroBody$$('a')[0].innerText).to.equals('https://github.com/yashaka/NSelene/blob/master/variant_1.md')
      expect(zeroBody$$('a')[1].innerText).to.equals('http://github.com/yashaka/NSelene/blob/master/variant_2.md')
      expect(zeroBody$$('a')[2].innerText).to.equals('http://github.com/yashaka/NSelene/blob/master/variant_3.md#some_tag')
    })

    it('without http and https should render as inner link with -md', async () => {
        zeroAppendScriptMD(`
<localized main="ru"/>
  
(github.com/yashaka/NSelene/blob/master/variant_1.md)
`)
  
        await zero.render()
        expect(zeroBody$('p').innerText).to.equals('(github.com/yashaka/NSelene/blob/master/variant_1-md)')
      })
  })
}
