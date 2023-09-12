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
  describe('TOC rendering testing', () => {
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

        expect(zeroBody$(`.`).innerText).to.equals('Header 1 JS')
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
<localized main="uk"/>

[TOC]<!--TOC>2-->
      
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js> any text</en><ru>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> любой текст</ru><uk>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> будь-який текст</uk> {#first-item}`)

        await zero.render()

        expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('Заголовок 1 PY любой текст')
      })

      it('middle element in codalized tags rendered correctly in TOC including any text behind the tag at the end in RU in language', async () => {
        zeroAppendScriptMD(`
<codalized main="java"/>
<localized main="uk"/>

[TOC]<!--TOC>2-->
      
### <en>Header 1 <py>PY</py><java>JAVA</java><js>JS</js> any text</en><ru>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> любой текст</ru><uk>Заголовок 1 <py>PY</py><java>JAVA</java><js>JS</js> будь-який текст</uk> {#first-item}`)

        await zero.render()

        expect(zeroBody$('a[href="#first-item"]').innerText).to.equals('Заголовок 1 JAVA любой текст')
      })

      it('last element in codalized tags rendered correctly in TOC including any text behind the tag at the end in RU in language', async () => {
        zeroAppendScriptMD(`
<codalized main="js"/>
<localized main="uk"/>

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

  describe('General translations testing', () => {
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

    it('correct work', async () => {
      zeroAppendScriptMD(
      '<!--~{{Variable}}~mustBeVisible~-->\n' +
      '\n'+ 
      '<p>{{Variable}}</p>'
      )
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('mustBeVisible')
    })

  })

  describe('Variable testing', () => {
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

    it('<!--uk~{{Variable}}~Змінна~--> correct work', async () => {
      zeroAppendScriptMD(
      '<!--uk~{{Variable}}~Змінна~-->\n' +
      '<localized main="uk"/>\n'+
      '\n'+ 
      '<p><uk>{{Variable}}</uk></p>'
      )
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('Змінна')
    })

    it('<!--uk~{{Variable}}~Змінна~--> <en-ru> must dont work', async () => {
      zeroAppendScriptMD(
      '<!--uk~{{Variable}}~Змінна~-->\n' +
      '<localized main="ru"/>\n'+
      '\n'+ 
      '<p><en-ru>{{Variable}}</en-ru></p>'
      )
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('{{Variable}}')
    })

    it('<!--en-ru~{{Variable}}~Variable~--> <ru> correct work', async () => {
      zeroAppendScriptMD(
      '<!--en-ru~{{Variable}}~Variable~-->\n' +
      '<localized main="ru"/>\n'+
      '\n'+ 
      '<p><ru>{{Variable}}</ru></p>'
      )
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('Variable')
    })
    
    it('<!--en-ru~{{Variable}}~Variable~--> <en> correct work', async () => {
      zeroAppendScriptMD(
      '<!--en-ru~{{Variable}}~Variable~-->\n' +
      '<localized main="en"/>\n'+
      '\n'+ 
      '<p><en>{{Variable}}</en></p>'
      )
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('Variable')
    })
        
    it('<!--en-ru~{{Variable}}~Variable~--> <uk> must dont work', async () => {
      zeroAppendScriptMD(
      '<!--en-ru~{{Variable}}~Variable~-->\n' +
      '<localized main="uk"/>\n'+
      '\n'+ 
      '<p><uk>{{Variable}}</uk></p>'
      )
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('{{Variable}}')
    })
        
    it('<!--js-ts~{{Variable}}~Variable~--> <js-ts> correct work', async () => {
      zeroAppendScriptMD(
      '<!--js~{{Variable}}~Variable~-->\n' +
      '<codalized main="js"/>\n'+
      '\n'+ 
      '<p><js-ts>{{Variable}}</js-ts></p>'
      )
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('Variable')
    })
            
    it('<!--js-ts~{{Variable}}~Variable~--> <uk> must dont work', async () => {
      zeroAppendScriptMD(
      '<!--js~{{Variable}}~Variable~-->\n' +
      '<codalized main="py"/>\n'+
      '\n'+ 
      '<p><java-py-cs>{{Variable}}</java-py-cs></p>'
      )
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('{{Variable}}')
    })
  })

  describe('Indented translation definition to align translations for easier refactoring', () => {
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

    let scenarios = {
      '"en", "py"': {
        dashes: '--',
        whenLang: 'en',
        whenCode: 'py',
        shouldBe: 'Header browser.config.base_url PY any text',
      },
      '"uk", "java"': {
        dashes: '---',
        whenLang: 'uk',
        whenCode: 'java',
        shouldBe: 'Заголовок Configuration.baseUrl JAVA будь який текст',
      },
      '"uk", "cs"': {
        dashes: '----------------',
        whenLang: 'uk',
        whenCode: 'cs',
        shouldBe: 'Заголовок Configuration.BaseUrl CS будь який текст',
      },
    }

    Object.entries(scenarios).forEach((args) => {
      const [
        scenario,
        { only, dashes, whenLang: lang, whenCode: code, shouldBe: text }
      ] = args
      if (only !== undefined && !only) {
        return
      }
      it(`${dashes} work with  ${scenario}`, async () => {
        zeroAppendScriptMD(
        '<localized main="uk"/>\n'+
        '<codalized main="js"/>\n'+    
        `<!${dashes}js-ts~{{browser\.config\.baseUrl}}~browser.config.baseUrl~-->\n`+
        `<!${dashes}py~{{browser\.config\.baseUrl}}~browser.config.base_url~-->\n`+
        `<!${dashes}java~{{browser\.config\.baseUrl}}~Configuration.baseUrl~-->\n`+
        `<!${dashes}cs~{{browser\.config\.baseUrl}}~Configuration.BaseUrl~-->\n`+
        '\n' +
        '<en>Header <py>{{browser.config.baseUrl}} PY</py><java>{{browser.config.baseUrl}} JAVA</java><js>{{browser.config.baseUrl}} JS</js>\n'+
        '<ts>{{browser.config.baseUrl}} TS</ts><cs>{{browser.config.baseUrl}} CS</cs> any text</en>\n'+
        '\n' +
        '<uk>Заголовок <py>{{browser.config.baseUrl}} PY</py><java>{{browser.config.baseUrl}} JAVA</java><js>{{browser.config.baseUrl}} JS</js>\n'+
        '<ts>{{browser.config.baseUrl}} TS</ts><cs>{{browser.config.baseUrl}} CS</cs> будь який текст</uk>\n'+
        '\n' +
        '<ru>Заглавие <py>{{browser.config.baseUrl}} PY</py><java>{{browser.config.baseUrl}} JAVA</java><js>{{browser.config.baseUrl}} JS</js>\n'+
        '<ts>{{browser.config.baseUrl}} TS</ts><cs>{{browser.config.baseUrl}} CS</cs> любой текст</ru>\n'
        )
        zero.lang = lang
        zero.code = code
        
        await zero.render()
  
        expect(zeroBody$('p').innerText).to.equals(text)
      })
    }) 
  })

  describe('long breaks /^====+/ should not work inside code blocks', () => {
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

    const longBreaksNumber = 20
    const shortBreaksNumber = 2
  
    // TODO: cant find element
    it.skip('Should have no longBreak ====+ inside code blocks', async () => {
      zeroAppendScriptMD(
'```js\n' +
'/*\n' +
'====\n' +
'*/\n' +
'```\n')

      await zero.render()
      expect(zeroBody$('code.code-js').innerText).to.equals('/*\n====\n*/')
    })

    it('Should have no longBreak ====+ inside code blocks', async () => {
      zeroAppendScriptMD(
'::::::::::manual\n' +
'```poetry: js"js (poetry)"\n' +
'/*\n' +
'====\n' +
'*/\n' +
'```\n' +
'::::::::::\n')

      await zero.render()
      expect(zeroBody$('code.code-js').innerText).to.equals('/*\n====\n*/')
    })

    it('Should have longBreak instead of ====+', async () => {
      zeroAppendScriptMD(
'\n' +
'====\n' +
'\n' +
'There should be long break above starting from the header.')

      await zero.render()

      expect(zeroBody().getElementsByTagName('br').length).to.equals(longBreaksNumber)
    })

    it('Should have longBreak instead of ====+ from variable', async () => {
      zeroAppendScriptMD(
'<localized main="en"/>\n' +
'<!--en-uk-ru~{{SOLUTION}}~,,,,,,,,,,,,\n' +
'**⇩SOLUTION⇩**\n' +
'============~-->\n' +
'\n' +
'You will see answer to the main question in the universe after long break below...\n' +
'\n' +
'{{SOLUTION}}\n' +
'\n' +
'42')

      await zero.render()

      expect(zeroBody().getElementsByTagName('br').length).to.equals(shortBreaksNumber + longBreaksNumber)
    })
    
  })

    describe('Local import testing', () => {
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

    let scenarios = {
      '"{{Review}}", "ru", "py"': {
        whenLang: 'ru',
        whenCode: 'py',
        whatWeUse: '{{Review}}',
        shouldBe: 'Ревью',
      },
      '"{{lang}}", "en", "cs"': {
        whenLang: 'en',
        whenCode: 'cs',
        whatWeUse: '{{lang}}',
        shouldBe: 'C#',
      },
      '"{{NO_CHANGES}}", "uk", "java"': {
        whenLang: 'uk',
        whenCode: 'java',
        whatWeUse: '{{NO_CHANGES}}',
        shouldBe: 'без змін',
      },
    }

    Object.entries(scenarios).forEach((args) => {
      const [
        scenario,
        { only, whenLang: lang, whenCode: code, whatWeUse, shouldBe: text }
      ] = args
      if (only !== undefined && !only) {
        return
      }
      it(`<!--import()--> work with  ${scenario}`, async () => {
        zeroAppendScriptMD(
'<!--import(./variables-for-local-import-tests.md)-->\n'+
`<localized main="${lang}"/>\n`+
`<codalized main="${code}"/>\n` +
'<p>\n'+  
`<uk-en-ru><py-js-ts-java-cs>${whatWeUse}</py-js-ts-java-cs></uk-en-ru>\n` + 
'<p>')
        
        await zero.render()
  
        expect(zeroBody$('p').innerText).to.equals(text)
      })
    })
    
          it(`<!--import()--> work with "{{YOUTUBE()}}", "uk", "java"`, async () => {
            zeroAppendScriptMD(
'<!--import(./variables-for-local-import-tests.md)-->\n'+
'<localized main="uk"/>\n'+
'<codalized main="java"/>\n' +
'<p>\n'+  
`<uk-en-ru><py-js-ts-java-cs>{{YOUTUBE(https://youtu.be/I1SBGzclwE0)}}</py-js-ts-java-cs></uk-en-ru>\n` + 
'<p>')
        
        await zero.render()
  
        expect(zeroBody$('iframe').src).to.equals('https://www.youtube.com/embed/I1SBGzclwE0')
          })
          
          it(`<!--import()--> work with "{{LOOM()}}", "en", "js"`, async () => {
            zeroAppendScriptMD(
'<!--import(./variables-for-local-import-tests.md)-->\n'+
'<localized main="en"/>\n'+
'<codalized main="js"/>\n' +
'<p>\n'+  
`<uk-en-ru><py-js-ts-java-cs>{{LOOM(https://www.loom.com/share/75f1210f206f49348541008c0cf2ad1d)}}</py-js-ts-java-cs></uk-en-ru>\n` + 
'<p>')
        
        await zero.render()
  
        expect(zeroBody$('iframe').src).to.equals('https://www.loom.com/embed/75f1210f206f49348541008c0cf2ad1d')
      })
  })
}
