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

  describe('General translation', () => {
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
<!--~{{Variable}}~mustBeVisible~-->

<p>{{Variable}}</p>`)
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('mustBeVisible')
    })

    it('work correctly with case sensitive', async () => {
      zeroAppendScriptMD(`      
<!--~{{Variable}}~mustBeNoVisible~-->
<!--~{{variable}}~mustBeVisible~-->
 
<p>{{variable}}</p>`)
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('mustBeVisible')
    })

    it('work correctly in localized tag', async () => {
      zeroAppendScriptMD(`
<localized main="en"/>
<!--~{{Variable}}~mustBeVisible~-->

<p><en>{{Variable}}</en></p>`)
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('mustBeVisible')
    })

    it('work correctly in codalized tag', async () => {
      zeroAppendScriptMD(`
<codalized main="py"/>
<!--~{{Variable}}~mustBeVisible~-->

<p><py>{{Variable}}</py></p>`)
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('mustBeVisible')
    })
  })
}
