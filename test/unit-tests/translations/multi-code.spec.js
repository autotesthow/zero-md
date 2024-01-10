/* eslint-env mocha */
/* global chai */

import common from './../../utils/common.js'

export default function() {
  mocha.setup({
    ui: 'bdd'
  })

  chai.config.truncateThreshold = 0
  const expect = chai.expect

  describe('Multi-code', () => {
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
        
    it('correct work with first code', async () => {
      zeroAppendScriptMD(`
<!--js-ts~{{Variable}}~Variable~-->
<codalized main="js"/>
 
<p><js>{{Variable}}</js></p>`)
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('Variable')
    })
           
    it('correct work with last code', async () => {
      zeroAppendScriptMD(`
<!--js-ts~{{Variable}}~Variable~-->
<codalized main="ts"/>

<p><ts>{{Variable}}</ts></p>`)
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('Variable')
    })
            
    it('dont work with other code', async () => {
      zeroAppendScriptMD(`
<!--js-ts~{{Variable}}~Variable~-->
<codalized main="py"/>

<p><java-py-cs>{{Variable}}</java-py-cs></p>`)
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('{{Variable}}')
    })
  })
}
