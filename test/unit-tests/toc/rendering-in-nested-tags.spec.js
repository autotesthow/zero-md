/* eslint-env mocha */
/* global chai */

import common from './../../utils/common.js'

export default function() {
  mocha.setup({
    ui: 'bdd'
  })

  chai.config.truncateThreshold = 0
  const expect = chai.expect

  describe('Rendering in nested tags', () => {
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

    it('middle element in codalized tags rendered correctly in TOC', async () => {
      zeroAppendScriptMD(`
<codalized main="java"/>

[TOC]<!--TOC>2-->
    
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js></en> {#first-item}`)

      await zero.render()

      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('Header 1 JAVA')
    })

    it('last element in codalized tags rendered correctly in TOC', async () => {
      zeroAppendScriptMD(`
<codalized main="js"/>

[TOC]<!--TOC>2-->
    
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js></en> {#first-item}`)

      await zero.render()

      expect(zeroBody$(`a[href="#first-item"]`).innerText).to.equals('Header 1 JS')
    })

    it('first element in codalized tags rendered correctly in TOC including any text behind the tag at the end', async () => {
      zeroAppendScriptMD(`
<codalized main="py"/>

[TOC]<!--TOC>2-->
    
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js> any text</en> {#first-item}`)

      await zero.render()

      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('Header 1 PY any text')
    })

    it('middle element in codalized tags rendered correctly in TOC including any text behind the tag at the end', async () => {
      zeroAppendScriptMD(`
<codalized main="java"/>

[TOC]<!--TOC>2-->
    
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js> any text</en> {#first-item}`)

      await zero.render()

      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('Header 1 JAVA any text')
    })

    it('last element in codalized tags rendered correctly in TOC including any text behind the tag at the end', async () => {
      zeroAppendScriptMD(`
<codalized main="js"/>

[TOC]<!--TOC>2-->
    
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js> any text</en> {#first-item}`)

      await zero.render()

      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('Header 1 JS any text')
    })

    it('first element in codalized tags rendered correctly in TOC including any text behind the tag at the end in UK in language', async () => {
      zeroAppendScriptMD(`
<codalized main="py"/>
<localized main="uk"/>

[TOC]<!--TOC>2-->
    
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js> any text</en><ru>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> любой текст</ru><uk>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> будь-який текст</uk> {#first-item}`)

      await zero.render()

      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('Заголовок 1 PY будь-який текст')
    })

    it('middle element in codalized tags rendered correctly in TOC including any text behind the tag at the end in UK in language', async () => {
      zeroAppendScriptMD(`
<codalized main="java"/>
<localized main="uk"/>

[TOC]<!--TOC>2-->
    
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js> any text</en><ru>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> любой текст</ru><uk>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> будь-який текст</uk> {#first-item}`)

      await zero.render()

      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('Заголовок 1 JAVA будь-який текст')
    })

    it('last element in codalized tags rendered correctly in TOC including any text behind the tag at the end in UK in language', async () => {
      zeroAppendScriptMD(`
<codalized main="js"/>
<localized main="uk"/>

[TOC]<!--TOC>2-->
    
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js> any text</en><ru>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> любой текст</ru><uk>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> будь-який текст</uk> {#first-item}`)

      await zero.render()

      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('Заголовок 1 JS будь-який текст')
    })

    it('first element in codalized tags rendered correctly in TOC including any text behind the tag at the end in RU in language', async () => {
      zeroAppendScriptMD(`
<codalized main="py"/>
<localized main="ru"/>

[TOC]<!--TOC>2-->
    
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js> any text</en><ru>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> любой текст</ru><uk>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> будь-який текст</uk> {#first-item}`)

      await zero.render()

      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('Заголовок 1 PY любой текст')
    })

    it('middle element in codalized tags rendered correctly in TOC including any text behind the tag at the end in RU in language', async () => {
      zeroAppendScriptMD(`
<codalized main="java"/>
<localized main="ru"/>

[TOC]<!--TOC>2-->
    
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js> any text</en><ru>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> любой текст</ru><uk>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> будь-який текст</uk> {#first-item}`)

      await zero.render()

      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('Заголовок 1 JAVA любой текст')
    })

    it('last element in codalized tags rendered correctly in TOC including any text behind the tag at the end in RU in language', async () => {
      zeroAppendScriptMD(`
<codalized main="js"/>
<localized main="ru"/>

[TOC]<!--TOC>2-->
    
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js> any text</en><ru>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> любой текст</ru><uk>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> будь-який текст</uk> {#first-item}`)

      await zero.render()

      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('Заголовок 1 JS любой текст')
    })

    it('multiple links in codalized tags rendered correctly in TOC', async () => {
      zeroAppendScriptMD(`
<codalized main="py"/>

[TOC]<!--TOC>2-->

### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js> any text</en> {#first-item}
### <en>Header 2 <java>JAVA</java><py>PY</py><js>JS</js> any text</en> {#second-item}
### <en>Header 3 <java>JAVA</java><js>JS</js><py>PY</py> any text</en> {#third-item}`)

      await zero.render()

      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('Header 1 PY any text')
      expect(zeroBody$('a[href="#second-item"]').innerText).to.equals('Header 2 PY any text')
      expect(zeroBody$('a[href="#third-item"]').innerText).to.equals('Header 3 PY any text')
    })
  })
}
