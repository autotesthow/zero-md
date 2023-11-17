/* eslint-env mocha */
/* global chai */

export default function() {
  mocha.setup({
    ui: 'bdd'
  })

  chai.config.truncateThreshold = 0
  const expect = chai.expect

  const add = (html) => {
    const template = document.createElement('template')
    template.innerHTML = html
    return document.body.appendChild(template.content.firstElementChild)
  }

  describe('Multi-lang', () => {
    let zero
    beforeEach(() => {
      zero = add(`<zero-md manual-render></zero-md>`)
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
    
    it('correct work with first lang', async () => {
      zeroAppendScriptMD(`
<!--en-ru~{{Variable}}~Variable~-->
<localized main="en"/>

<p><en>{{Variable}}</en></p>`)
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('Variable')
    })

    it('correct work with last lang', async () => {
      zeroAppendScriptMD(`
<!--en-ru~{{Variable}}~Variable~-->
<localized main="ru"/>
 
<p><ru>{{Variable}}</ru></p>`)
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('Variable')
    })
        
    it('dont work with other lang', async () => {
      zeroAppendScriptMD(`
<!--en-ru~{{Variable}}~Variable~-->
<localized main="uk"/>

<p><uk>{{Variable}}</uk></p>`)
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('{{Variable}}')
    })
  })
}
