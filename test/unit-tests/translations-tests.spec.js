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

    it('correct work case sensitive', async () => {
      zeroAppendScriptMD(
      '<!--~{{Variable}}~mustBeNoVisible~-->\n' +
      '<!--~{{variable}}~mustBeVisible~-->\n' +
      '\n'+ 
      '<p>{{variable}}</p>'
      )
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('mustBeVisible')
    })

  })

  describe('One-lang translation', () => {
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
      zeroAppendScriptMD(
      '<!--uk~{{Variable}}~Змінна~-->\n' +
      '<localized main="uk"/>\n'+
      '\n'+ 
      '<p><uk>{{Variable}}</uk></p>'
      )
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('Змінна')
    })

    it('incorrect lang must dont work with other langs', async () => {
      zeroAppendScriptMD(
      '<!--uk~{{Variable}}~Змінна~-->\n' +
      '<localized main="ru"/>\n'+
      '\n'+ 
      '<p><en-ru>{{Variable}}</en-ru></p>'
      )
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('{{Variable}}')
    })
  })

  describe('One-code translation', () => {
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
      zeroAppendScriptMD(
      '<!--java~{{Variable}}~Java~-->\n'+
      '<codalized main="java"/>\n'+
      '\n'+ 
      '<p><java>{{Variable}}</java></p>'
      )
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('Java')
    })

    it('incorrect code must dont work with other codes', async () => {
      zeroAppendScriptMD(
      '<!--java~{{Variable}}~Java~-->\n'+
      '<codalized main="js"/>\n'+
      '\n'+ 
      '<p><js-ts-py-cs>{{Variable}}</js-ts-py-cs></p>'
      )
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('{{Variable}}')
    })
  })

  describe('Multi-lang translation', () => {
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
      zeroAppendScriptMD(
      '<!--en-ru~{{Variable}}~Variable~-->\n' +
      '<localized main="en"/>\n'+
      '\n'+ 
      '<p><en>{{Variable}}</en></p>'
      )
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('Variable')
    })

    it('correct work with last lang', async () => {
      zeroAppendScriptMD(
      '<!--en-ru~{{Variable}}~Variable~-->\n' +
      '<localized main="ru"/>\n'+
      '\n'+ 
      '<p><ru>{{Variable}}</ru></p>'
      )
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('Variable')
    })
        
    it('dont work with other lang', async () => {
      zeroAppendScriptMD(
      '<!--en-ru~{{Variable}}~Variable~-->\n' +
      '<localized main="uk"/>\n'+
      '\n'+ 
      '<p><uk>{{Variable}}</uk></p>'
      )
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('{{Variable}}')
    })
  })

  describe('Multi-code translation', () => {
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
        
    it('correct work with first code', async () => {
      zeroAppendScriptMD(
      '<!--js-ts~{{Variable}}~Variable~-->\n' +
      '<codalized main="js"/>\n'+
      '\n'+ 
      '<p><js>{{Variable}}</js></p>'
      )
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('Variable')
    })
           
    it('correct work with last code', async () => {
      zeroAppendScriptMD(
      '<!--js-ts~{{Variable}}~Variable~-->\n' +
      '<codalized main="ts"/>\n'+
      '\n'+ 
      '<p><ts>{{Variable}}</ts></p>'
      )
     
      await zero.render()

      expect(zeroBody$('p').innerText).to.equals('Variable')
    })
            
    it('dont work with other code', async () => {
      zeroAppendScriptMD(
      '<!--js-ts~{{Variable}}~Variable~-->\n' +
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
        `<!${dashes}js-ts~{{browser.config.baseUrl}}~browser.config.baseUrl~-->\n`+
        `<!${dashes}py~{{browser.config.baseUrl}}~browser.config.base_url~-->\n`+
        `<!${dashes}java~{{browser.config.baseUrl}}~Configuration.baseUrl~-->\n`+
        `<!${dashes}cs~{{browser.config.baseUrl}}~Configuration.BaseUrl~-->\n`+
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
}
