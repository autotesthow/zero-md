/* eslint-env mocha */
/* global chai */

export default function() {
  mocha.setup({
    ui: 'bdd'
  })

  chai.config.truncateThreshold = 0
  const assert = chai.assert
  const expect = chai.expect

  const add = (html) => {
    const template = document.createElement('template')
    template.innerHTML = html
    return document.body.appendChild(template.content.firstElementChild)
  }

  describe('TOC rendering simple scenarios', () => {
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
    const zeroBody$$ = (selector) => zeroBody().querySelectorAll(selector)

    const zeroAppendScriptMD = (text) => {
      const script = document.createElement('script')
      script.setAttribute('type', 'text/markdown')
      script.text = text
      zero.appendChild(script)
    }

    it('# correctly', async () => {
      zeroAppendScriptMD(`
[TOC]<!--TOC>-->
      
# 1 title {#first-item}`)

      await zero.render()

      expect(zeroBody$('.toc div').style.marginLeft).to.equals('0px')
      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('1 title')
    })

    it('## correctly', async () => {
      zeroAppendScriptMD(`
[TOC]<!--TOC>-->
      
## 1 title {#first-item}`)

      await zero.render()

      expect(zeroBody$('.toc div').style.marginLeft).to.equals('40px')
      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('1 title')
    })
    
    it('### correctly', async () => {
      zeroAppendScriptMD(`
[TOC]<!--TOC>-->
      
### 1 title {#first-item}`)

      await zero.render()

      expect(zeroBody$('.toc div').style.marginLeft).to.equals('80px')
      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('1 title')
    })

    it('#### correctly', async () => {
      zeroAppendScriptMD(`
[TOC]<!--TOC>-->
      
#### 1 title {#first-item}`)

      await zero.render()

      expect(zeroBody$('.toc div').style.marginLeft).to.equals('120px')
      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('1 title')
    })
    
    it('by filter with level 0', async () => {
      zeroAppendScriptMD(`
[TOC]<!--TOC>-->
      
# 1 title {#first-item}
## 2 title {#second-item}
### 3 title {#third-item}
#### 4 title {#fourth-item}`)

      await zero.render()

      expect(zeroBody$('.toc div:nth-child(1)').style.marginLeft).to.equals('0px')
      expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('1 title')
      expect(zeroBody$('.toc div:nth-child(2)').style.marginLeft).to.equals('40px')
      expect(zeroBody$('a[href="#second-item"]').innerText).to.equals('2 title')
      expect(zeroBody$('.toc div:nth-child(3)').style.marginLeft).to.equals('80px')
      expect(zeroBody$('a[href="#third-item"]').innerText).to.equals('3 title')
      expect(zeroBody$('.toc div:nth-child(4)').style.marginLeft).to.equals('120px')
      expect(zeroBody$('a[href="#fourth-item"]').innerText).to.equals('4 title')
    })
  
    it('by filter with level 1', async () => {
      zeroAppendScriptMD(`
[TOC]<!--TOC>1-->

# 1 title {#first-item}
## 2 title {#second-item}
### 3 title {#third-item}
#### 4 title {#fourth-item}`)

      await zero.render()

      expect(zeroBody$('.toc div:nth-child(1)').style.marginLeft).to.equals('0px')
      expect(zeroBody$('a[href="#second-item"]').innerText).to.equals('2 title')
      expect(zeroBody$('.toc div:nth-child(2)').style.marginLeft).to.equals('40px')
      expect(zeroBody$('a[href="#third-item"]').innerText).to.equals('3 title')
      expect(zeroBody$('.toc div:nth-child(3)').style.marginLeft).to.equals('80px')
      expect(zeroBody$('a[href="#fourth-item"]').innerText).to.equals('4 title')
    })
  
    it('by filter with level 2', async () => {
      zeroAppendScriptMD(`
[TOC]<!--TOC>2-->
      
# 1 title {#first-item}
## 2 title {#second-item}
### 3 title {#third-item}
#### 4 title {#fourth-item}`)

      await zero.render()

      expect(zeroBody$('.toc div:nth-child(1)').style.marginLeft).to.equals('0px')
      expect(zeroBody$('a[href="#third-item"]').innerText).to.equals('3 title')
      expect(zeroBody$('.toc div:nth-child(2)').style.marginLeft).to.equals('40px')
      expect(zeroBody$('a[href="#fourth-item"]').innerText).to.equals('4 title')
    })

    it('by filter with level 3', async () => {
      zeroAppendScriptMD(`
[TOC]<!--TOC>3-->
      
# 1 title {#first-item}
## 2 title {#second-item}
### 3 title {#third-item}
#### 4 title {#fourth-item}`)

      await zero.render()

      expect(zeroBody$('.toc div:nth-child(1)').style.marginLeft).to.equals('0px')
      expect(zeroBody$('a[href="#fourth-item"]').innerText).to.equals('4 title')
    })
    
    it('# correctly without anchor', async () => {
      zeroAppendScriptMD(`
[TOC]<!--TOC>-->
      
# 1 title`)

      await zero.render()

      expect(zeroBody$('.toc div').style.marginLeft).to.equals('0px')
      expect(zeroBody$('a[href="#1-title"]').innerText).to.equals('1 title')
    })

    it('# correctly without anchor with trouble naming', async () => {
      zeroAppendScriptMD(`
[TOC]<!--TOC>1-->
      
## 1        .   $%^*  title`)

      await zero.render()

      expect(zeroBody$('.toc div').style.marginLeft).to.equals('0px')
      expect(zeroBody$('a[href="#1-title"]').innerText).to.equals('1 . $%^* title')
    })
      
    it('by filter with level 2 without anchor', async () => {
      zeroAppendScriptMD(`
[TOC]<!--TOC>2-->
      
# 1 title
## 2 title 
### 3 title
#### 4 title`)

      await zero.render()

      expect(zeroBody$('.toc div:nth-child(1)').style.marginLeft).to.equals('0px')
      expect(zeroBody$('a[href="#3-title"]').innerText).to.equals('3 title')
      expect(zeroBody$('.toc div:nth-child(2)').style.marginLeft).to.equals('40px')
      expect(zeroBody$('a[href="#4-title"]').innerText).to.equals('4 title')
    })
  })

  describe('TOC rendering with localized/codalized', () => {
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
    const zeroBody$$ = (selector) => zeroBody().querySelectorAll(selector)

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

    // TODO: remove ".skip" when task : https://kanbanflow.com/t/H43XL3Vs will be done
    describe.skip('rendering in nested tags', () => {
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
  })
}
