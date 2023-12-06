/* eslint-env mocha */
/* global chai */

import { Zero } from '../utils/Zero.js'

export default function() {
  mocha.setup({
    ui: 'bdd'
  })

  chai.config.truncateThreshold = 0
  const expect = chai.expect

  const zero = new Zero()

  describe('long breaks', () => {
    beforeEach(() => {
      zero.addHtml(`<zero-md manual-render></zero-md>`)
    })
    afterEach(() => {
      zero.remove()
    })
    
    const longBreaksNumber = 20
    const shortBreaksNumber = 2
  
    // TODO: cant find element
    it.skip('Should have no longBreak ====+ inside code blocks', async () => {
      zero.appendScriptMD(`
\`\`\`js
/*
====
*/
\`\`\``)

      await zero.render()
      expect(zero.body$('code.code-js').innerText).to.equals('/*\n====\n*/')
    })

    it('Should have no longBreak ====+ inside code blocks', async () => {
      zero.appendScriptMD(`
::::::::::manual
\`\`\`poetry: js"js (poetry)"
/*
====
*/
\`\`\`
::::::::::`)

      await zero.render()

      expect(zero.body$('code.code-js').innerText).to.equals('/*\n====\n*/')
    })

    it('Should have longBreak instead of ====+', async () => {
      zero.appendScriptMD(`

====

There should be long break above starting from the header.`)

      await zero.render()

      expect(zero.body().getElementsByTagName('br').length).to.equals(longBreaksNumber)
    })

    it('Should have longBreak instead of ====+ from variable', async () => {
      zero.appendScriptMD(`
<localized main="en"/>
<!--en-uk-ru~{{SOLUTION}}~,,,,,,,,,,,,
**⇩SOLUTION⇩**
============~-->

You will see answer to the main question in the universe after long break below...

{{SOLUTION}}

42`)

      await zero.render()

      expect(zero.body().getElementsByTagName('br').length).to.equals(shortBreaksNumber + longBreaksNumber)
    })
  })
}
