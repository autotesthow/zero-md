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

  const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t))

  describe('functionality TOC', () => {
    let zero
    beforeEach(() => {
      zero = add(`<zero-md manukl-render></zero-md>`)
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


    it('first element in codalized tags rendered correctly in TOC', async () => {
      zeroAppendScriptMD(`
<codalized main="py"/>

[TOC]<!--TOC>2-->
      
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js></en> {#first-item}`)

      await zero.render()

      expect(zeroBody$(`a[href="#first-item"]`).innerText).to.equals('Header 1 PY')
    })

    it.skip('middle element in codalized tags rendered correctly in TOC', async () => {
      zeroAppendScriptMD(`
<codalized main="java"/>

[TOC]<!--TOC>2-->
      
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js></en> {#first-item}`)

      await zero.render()

      expect(zeroBody$(`a[href="#first-item"]`).innerText).to.equals('Header 1 JAVA')
    })

    it.skip('last element in codalized tags rendered correctly in TOC', async () => {
      zeroAppendScriptMD(`
<codalized main="js"/>

[TOC]<!--TOC>2-->
      
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js></en> {#first-item}`)

      await zero.render()

      expect(zeroBody$(`.`).innerText).to.equals('Header 1 JS')
    })

    it.skip('first element in codalized tags rendered correctly in TOC including any text behind the tag at the end', async () => {
      zeroAppendScriptMD(`
<codalized main="py"/>

[TOC]<!--TOC>2-->
      
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js> any text</en> {#first-item}`)

      await zero.render()

      expect(zeroBody$(`a[href="#first-item"]`).innerText).to.equals('Header 1 PY any text')
    })

    it.skip('middle element in codalized tags rendered correctly in TOC including any text behind the tag at the end', async () => {
      zeroAppendScriptMD(`
<codalized main="java"/>

[TOC]<!--TOC>2-->
      
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js> any text</en> {#first-item}`)

      await zero.render()

      expect(zeroBody$(`a[href="#first-item"]`).innerText).to.equals('Header 1 JAVA any text')
    })

    it.skip('last element in codalized tags rendered correctly in TOC including any text behind the tag at the end', async () => {
      zeroAppendScriptMD(`
<codalized main="js"/>

[TOC]<!--TOC>2-->
      
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js> any text</en> {#first-item}`)

      await zero.render()

      expect(zeroBody$(`a[href="#first-item"]`).innerText).to.equals('Header 1 JS any text')
    })

    it.skip('first element in codalized tags rendered correctly in TOC including any text behind the tag at the end in UK in langukge', async () => {
      zeroAppendScriptMD(`
<codalized main="py"/>
<localized main="uk"/>

[TOC]<!--TOC>2-->
      
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js> any text</en><ru>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> любой текст</ru><uk>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> будь-який текст</uk> {#first-item}`)

      await zero.render()

      expect(zeroBody$(`a[href="#first-item"]`).innerText).to.equals('Заголовок 1 PY будь-який текст')
    })

    it.skip('middle element in codalized tags rendered correctly in TOC including any text behind the tag at the end in UK in langukge', async () => {
      zeroAppendScriptMD(`
<codalized main="java"/>
<localized main="uk"/>

[TOC]<!--TOC>2-->
      
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js> any text</en><ru>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> любой текст</ru><uk>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> будь-який текст</uk> {#first-item}`)

      await zero.render()

      expect(zeroBody$(`a[href="#first-item"]`).innerText).to.equals('Заголовок 1 JAVA будь-який текст')
    })

    it.skip('last element in codalized tags rendered correctly in TOC including any text behind the tag at the end in UK in langukge', async () => {
      zeroAppendScriptMD(`
<codalized main="js"/>
<localized main="uk"/>

[TOC]<!--TOC>2-->
      
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js> any text</en><ru>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> любой текст</ru><uk>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> будь-який текст</uk> {#first-item}`)

      await zero.render()

      expect(zeroBody$(`a[href="#first-item"]`).innerText).to.equals('Заголовок 1 JS будь-який текст')
    })

    it.skip('first element in codalized tags rendered correctly in TOC including any text behind the tag at the end in RU in langukge', async () => {
      zeroAppendScriptMD(`
<codalized main="py"/>
<localized main="uk"/>

[TOC]<!--TOC>2-->
      
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js> any text</en><ru>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> любой текст</ru><uk>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> будь-який текст</uk> {#first-item}`)

      await zero.render()

      expect(zeroBody$(`a[href="#first-item"]`).innerText).to.equals('Заголовок 1 PY любой текст')
    })

    it.skip('middle element in codalized tags rendered correctly in TOC including any text behind the tag at the end in RU in langukge', async () => {
      zeroAppendScriptMD(`
<codalized main="java"/>
<localized main="uk"/>

[TOC]<!--TOC>2-->
      
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js> any text</en><ru>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> любой текст</ru><uk>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> будь-який текст</uk> {#first-item}`)

      await zero.render()

      expect(zeroBody$(`a[href="#first-item"]`).innerText).to.equals('Заголовок 1 JAVA любой текст')
    })

    it.skip('last element in codalized tags rendered correctly in TOC including any text behind the tag at the end in RU in langukge', async () => {
      zeroAppendScriptMD(`
<codalized main="js"/>
<localized main="uk"/>

[TOC]<!--TOC>2-->
      
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js> any text</en><ru>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> любой текст</ru><uk>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> будь-який текст</uk> {#first-item}`)

      await zero.render()

      expect(zeroBody$(`a[href="#first-item"]`).innerText).to.equals('Заголовок 1 JS любой текст')
    })

    it.skip('multiple links in codalized tags rendered correctly in TOC', async () => {
      zeroAppendScriptMD(`
<codalized main="py"/>

[TOC]<!--TOC>2-->

### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js> any text</en> {#first-item}
### <en>Header 2 <java>JAVA</java><py>PY</py><js>JS</js> any text</en> {#second-item}
### <en>Header 3 <java>JAVA</java><js>JS</js><py>PY</py> any text</en> {#third-item}`)

      await zero.render()

      expect(zeroBody$(`a[href="#first-item"]`).innerText).to.equals('Header 1 PY any text')
      expect(zeroBody$(`a[href="#second-item"]`).innerText).to.equals('Header 2 PY any text')
      expect(zeroBody$(`a[href="#third-item"]`).innerText).to.equals('Header 3 PY any text')
    })
  })

  describe('general translations', () => {
    let zero
    beforeEach(() => {
      zero = add(`<zero-md manukl-render></zero-md>`)
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

    let scenarios = {
      '"en", "py"': {
        whenLang: 'en',
        whenCode: 'py',
        shouldBe: 'Header PY any text',
      },
      '"en", "java"': {
        whenLang: 'en',
        whenCode: 'java',
        shouldBe: 'Header JAVA any text',
      },
      '"en", "js"': {
        whenLang: 'en',
        whenCode: 'js',
        shouldBe: 'Header JS any text',
      },
      '"en", "ts"': {
        whenLang: 'en',
        whenCode: 'ts',
        shouldBe: 'Header JS any text',
      },
      '"en", "cs"': {
        whenLang: 'en',
        whenCode: 'cs',
        shouldBe: 'Header CS any text',
      },
      '"uk", "py"': {
        whenLang: 'uk',
        whenCode: 'py',
        shouldBe: 'Заголовок PY будь який текст',
      },
      '"uk", "java"': {
        whenLang: 'uk',
        whenCode: 'java',
        shouldBe: 'Заголовок JAVA будь який текст',
      },
      '"uk", "js"': {
        whenLang: 'uk',
        whenCode: 'js',
        shouldBe: 'Заголовок JS будь який текст',
      },
      '"uk", "ts"': {
        whenLang: 'uk',
        whenCode: 'ts',
        shouldBe: 'Заголовок JS будь який текст',
      },
      '"uk", "cs"': {
        whenLang: 'uk',
        whenCode: 'cs',
        shouldBe: 'Заголовок CS будь який текст',
      },
      '"ru", "py"': {
        whenLang: 'ru',
        whenCode: 'py',
        shouldBe: 'Заглавие PY любой текст',
      },
      '"ru", "java"': {
        whenLang: 'ru',
        whenCode: 'java',
        shouldBe: 'Заглавие JAVA любой текст',
      },
      '"ru", "js"': {
        whenLang: 'ru',
        whenCode: 'js',
        shouldBe: 'Заглавие JS любой текст',
      },
      '"ru", "ts"': {
        whenLang: 'ru',
        whenCode: 'ts',
        shouldBe: 'Заглавие JS любой текст',
      },
      '"ru", "cs"': {
        whenLang: 'ru',
        whenCode: 'cs',
        shouldBe: 'Заглавие CS любой текст',
      },
    }

    Object.entries(scenarios).forEach((args) => {
      const [
        scenario,
        { only, whenLang: lang, whenCode: code, shouldBe: text }
      ] = args
      if (only !== undefined && !only) {
        return
      }
      it(`<!--~{{RED}}~style="color:red;"~--> work with  ${scenario}`, async () => {
        zeroAppendScriptMD(
        '<localized main="uk"/>\n'+
        '<codalized main="js"/>\n'+    
        '<!--~{{RED}}~style="color:red;"~-->\n'+
        '<p {{RED}}>\n'+
        '<en>Header <py>PY</py><java>JAVA</java><js-ts>JS</js-ts><cs>CS</cs> any text</en>'+
        '<uk>Заголовок <py>PY</py><java>JAVA</java><js-ts>JS</js-ts><cs>CS</cs> будь який текст</uk>'+
        '<ru>Заглавие <py>PY</py><java>JAVA</java><js-ts>JS</js-ts><cs>CS</cs> любой текст</ru>'+
        '</p>'
        )
        zero.lang = lang
        zero.code = code
        
        await zero.render()
  
        expect(zeroBody$(`p`).style.color).to.equals('red')
        expect(zeroBody$(`p`).innerText).to.equals(text)
      })
    })

    
//     it('<!--~{{NAME}}~any params~--> work with "en", "java"', async () => {
//       zeroAppendScriptMD(`
// <localized main="en"/>
// <codalized main="java"/>

// <!--~{{RED}}~style="color:red;"~-->

// <p {{RED}}><en>Header <py>PY</py><java>JAVA</java><js-ts>JS</js-ts><cs>CS</cs> any text</en></p>
// `)

//       await zero.render()
      
//       expect(zeroBody$(`p`).style.color).to.equals('red')
//       expect(zeroBody$(`p`).innerText).to.equals('Header JAVA any text')
//     })

//     it('<!--~{{NAME}}~any params~--> work with "en", "java"', async () => {
//       zeroAppendScriptMD(`
// <localized main="en"/>
// <codalized main="java"/>

// <!--~{{RED}}~style="color:red;"~-->

// <p {{RED}}><en>Header <py>PY</py><java>JAVA</java><js-ts>JS</js-ts><cs>CS</cs> any text</en></p>
// `)

//       await zero.render()
      
//       expect(zeroBody$(`p`).style.color).to.equals('red')
//       expect(zeroBody$(`p`).innerText).to.equals('Header JAVA any text')
//     })
  })
}
