/* eslint-env mocha */
/* global chai */

import common from './../../utils/common.js'

export default function() {
  mocha.setup({
    ui: 'bdd'
  })

  chai.config.truncateThreshold = 0
  const expect = chai.expect

  describe('Rendering with localized/codalized ', () => {
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

    it('first element in localized tags rendered correctly in TOC', async () => {
      zeroAppendScriptMD(`
<localized main="ru"/>

[TOC]<!--TOC>2-->
      
### <ru>Простой тест на</ru><uk>Простий тест на</uk><en>Simple test in</en> {#first-item}`)

      await zero.render()

      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('Простой тест на')
    })

    it('middle element in localized tags rendered correctly in TOC', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>

[TOC]<!--TOC>2-->
      
### <ru>Простой тест на</ru><uk>Простий тест на</uk><en>Simple test in</en> {#first-item}`)

      await zero.render()

      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('Простий тест на')
    })

    it('last element in localized tags rendered correctly in TOC', async () => {
      zeroAppendScriptMD(`
<localized main="en"/>

[TOC]<!--TOC>2-->
      
### <ru>Простой тест на</ru><uk>Простий тест на</uk><en>Simple test in</en> {#first-item}`)

      await zero.render()

      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('Simple test in')
    })

    it('first element in codalized tags rendered correctly in TOC', async () => {
      zeroAppendScriptMD(`
<codalized main="py"/>

[TOC]<!--TOC>2-->
      
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js></en> {#first-item}`)

      await zero.render()

      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('Header 1 PY')
    })
  })
}
