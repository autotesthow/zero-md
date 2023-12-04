/* eslint-env mocha */
/* global chai */

import common from './../utils/common.js'

export default function() {
  mocha.setup({
    ui: 'bdd'
  })

  chai.config.truncateThreshold = 0
  const expect = chai.expect

  describe('long breaks', () => {
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

    const longBreaksNumber = 20
    const shortBreaksNumber = 2
  
    // TODO: cant find element
    it.skip('Should have no longBreak ====+ inside code blocks', async () => {
      zeroAppendScriptMD(`
\`\`\`js
/*
====
*/
\`\`\``)

      await zero.render()
      expect(zeroBody$('code.code-js').innerText).to.equals('/*\n====\n*/')
    })

    it('Should have no longBreak ====+ inside code blocks', async () => {
      zeroAppendScriptMD(`
::::::::::manual
\`\`\`poetry: js"js (poetry)"
/*
====
*/
\`\`\`
::::::::::`)

      await zero.render()
      expect(zeroBody$('code.code-js').innerText).to.equals('/*\n====\n*/')
    })

    it('Should have longBreak instead of ====+', async () => {
      zeroAppendScriptMD(`

====

There should be long break above starting from the header.`)

      await zero.render()

      expect(zeroBody().getElementsByTagName('br').length).to.equals(longBreaksNumber)
    })

    it('Should have longBreak instead of ====+ from variable', async () => {
      zeroAppendScriptMD(`
<localized main="en"/>
<!--en-uk-ru~{{SOLUTION}}~,,,,,,,,,,,,
**⇩SOLUTION⇩**
============~-->

You will see answer to the main question in the universe after long break below...

{{SOLUTION}}

42`)

      await zero.render()

      expect(zeroBody().getElementsByTagName('br').length).to.equals(shortBreaksNumber + longBreaksNumber)
    })
  })
}
