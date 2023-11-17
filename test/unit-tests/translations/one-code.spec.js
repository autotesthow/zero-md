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

  describe('One-code', () => {
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

    it('correct work', async () => {
      zeroAppendScriptMD(`
<!--java~{{Variable}}~Java~-->
<codalized main="java"/>

<p><java>{{Variable}}</java></p>`)
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('Java')
    })

    it('incorrect code must dont work with other codes', async () => {
      zeroAppendScriptMD(`
<!--java~{{Variable}}~Java~-->
<codalized main="js"/>

<p><js-ts-py-cs>{{Variable}}</js-ts-py-cs></p>`)
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('{{Variable}}')
    })
  })
}
