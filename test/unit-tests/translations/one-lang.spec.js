/* eslint-env mocha */
/* global chai */

import common from './../../utils/common.js'

export default function() {
  mocha.setup({
    ui: 'bdd'
  })

  chai.config.truncateThreshold = 0
  const expect = chai.expect

   describe('One-lang', () => {
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

    it('correct work', async () => {
      zeroAppendScriptMD(`
<!--uk~{{Variable}}~Змінна~-->
<localized main="uk"/>
 
<p><uk>{{Variable}}</uk></p>`)
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('Змінна')
    })

    it('incorrect lang must dont work with other langs', async () => {
      zeroAppendScriptMD(`
<!--uk~{{Variable}}~Змінна~-->
<localized main="ru"/>
 
<p><en-ru>{{Variable}}</en-ru></p>`)
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('{{Variable}}')
    })
  })
}
