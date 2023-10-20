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

  let zero
  beforeEach(() => {
    zero = add(`<zero-md manual-render></zero-md>`)
  })
  afterEach(() => {
    zero.remove()
  })
  
  let baseUrl = window.location.href

  const zero$ = (selector) => zero.shadowRoot.querySelector(selector)
  const zeroBody = () => zero$('.markdown-body')
  const zeroBody$ = (selector) => zeroBody().querySelector(selector)

  const zeroAppendScriptMD = (text) => {
    const script = document.createElement('script')
    script.setAttribute('type', 'text/markdown')
    script.text = text
    zero.appendChild(script)
  }

  describe('Localization', () => {
    it('should set lang from "localized" tag inside MD', async () => {
      zeroAppendScriptMD(`
<localized main="en"/>

<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>`)
      await zero.render()
   
      expect(zeroBody$('localized').innerText).to.equal('Hello')
    })

    it('should be overrided from attributes', async () => {
      zeroAppendScriptMD(`
<localized main="en"/>

<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>`)

      zero.setAttribute('lang', 'ru')
      await zero.render()
  
      expect(zeroBody$('p').innerText).to.equal('Привет')
    })

    it('should be overrided from zeroMdConfig', async () => {
      zeroAppendScriptMD(`
<localized main="en"/>

<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>`)

      zero.config.lang = 'ru'
      await zero.render()
   
      expect(zeroBody$('localized').innerText).to.equal('Привет')
    })

    it('should be overrided from attributes after zeroMdConfig', async () => {
      zeroAppendScriptMD(`
<localized main="en"/>

<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>`)
      zero.config.lang = 'ru'

      zero.setAttribute('lang', 'uk')
      await zero.render()

      expect(zeroBody$('localized').innerText).to.equal('Привіт')
    })

    describe('Depending on URLSearchParams behavior testing', () => {
      afterEach(() => {
        window.history.replaceState(null, null, baseUrl);
      })
      it('should be overrided from URLSearchParams', async () => {
        zeroAppendScriptMD(`
<localized main="uk"/>

<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>`)
        
        const newQueryString = '?lang=en';
        window.history.pushState(null, null, baseUrl + newQueryString)
        await zero.render()
     
        expect(zeroBody$('p').innerText).to.equal('Hello')
      })
  
      it('should be overrided from URLSearchParams after attributes', async () => {
        zeroAppendScriptMD(`
<localized main="en"/>

<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>`)
        zero.setAttribute('lang', 'ru')

        const newQueryString = '?lang=uk';
        window.history.pushState(null, null, baseUrl + newQueryString)
        await zero.render() 
     
        expect(zeroBody$('localized').innerText).to.equal('Привіт')
      })
  
      it('should be overrided from URLSearchParams after zeroMdConfig', async () => {
        zeroAppendScriptMD(`
<localized main="en"/>

<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>`)
        zero.config.lang = 'uk'

        const newQueryString = '?lang=en';
        window.history.pushState(null, null, baseUrl + newQueryString)
        await zero.render()
     
        expect(zeroBody$('localized').innerText).to.equal('Hello')
      }) 
    })
  })

  describe('Codalization', () => {
    it('should set code from "codalized" tag inside MD', async () => {
      zeroAppendScriptMD(`
<codalized main="java"/>

<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>`)
      await zero.render()
   
      expect(zeroBody$('.inline-content.active').innerText).to.equal('JAVA')
    })

    it('should be overrided from zeroMdConfig', async () => {
      zeroAppendScriptMD(`
<codalized main="java"/>

<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>`)

      zero.config.code = 'py'
      await zero.render()
  
      expect(zeroBody$('.inline-content.active').innerText).to.equal('PY')
    })

    it('should be overrided from attributes', async () => {
      zeroAppendScriptMD(`
<codalized main="java"/>

<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>`)

      zero.setAttribute('code', 'cs')
      await zero.render()
   
      expect(zeroBody$('.inline-content.active').innerText).to.equal('CS')
    })

    it('should be overrided from attributes after zeroMdConfig', async () => {
      zeroAppendScriptMD(`
<codalized main="java"/>

<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>`)
      zero.config.code = 'py'

      zero.setAttribute('code', 'cs')
      await zero.render()
   
      expect(zeroBody$('.inline-content.active').innerText).to.equal('CS')
    })

    describe('Depending on URLSearchParams behavior testing', () => {
      afterEach(() => {
        window.history.replaceState(null, null, baseUrl);
      })
  
      it('should be overrided from URLSearchParams', async () => {
        zeroAppendScriptMD(`
<codalized main="java"/>

<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>`)
  
        const newQueryString = '?code=ts';
        window.history.pushState(null, null, baseUrl + newQueryString)
        await zero.render()
     
        expect(zeroBody$('.inline-content.active').innerText).to.equal('TS')
      })
  
      it('should be overrided from URLSearchParams after attributes', async () => {
        zeroAppendScriptMD(`
<codalized main="java"/>

<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>`) 
        zero.setAttribute('code', 'cs')

        const newQueryString = '?code=ts';
        window.history.pushState(null, null, baseUrl + newQueryString)
        await zero.render() 
     
        expect(zeroBody$('.inline-content.active').innerText).to.equal('TS')
      })
  
      it('should be overrided from URLSearchParams after zeroMdConfig', async () => {
        zeroAppendScriptMD(`
<codalized main="java"/>

<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>`)
        zero.config.code = 'ts'
        
        const newQueryString = '?code=py';
        window.history.pushState(null, null, baseUrl + newQueryString)
        await zero.render() 
     
        expect(zeroBody$('.inline-content.active').innerText).to.equal('PY')
      }) 
    })
  })

  describe('Localization and codalization with codegroups testing', () => {
    it('should set lang and code from codalized and localized tag if other options wasn\'t set' +
    ' AND switch appropriate tab and language', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>

<js>JS CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></js>
<ts>TS CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></ts>
<java>JAVA CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></java>

::::::::::::
\`\`\`js
<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>
\`\`\`
\`\`\`ts
<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>
\`\`\`
\`\`\`java
<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>
\`\`\`
::::::::::::`)

      await zero.render()

      expect(zeroBody$('.inline-content.active').innerText).to.equal('JAVA CONTENT Привіт')
      expect(zeroBody$('.tab-button.active').innerText).to.equal('java')
      expect(zeroBody$('.tab-content.active').innerText.split('\n')[0]).to.equal('Привіт')
    })

    it('values from ZeroMdConfig should override values from  codalized and localized' +
    ' AND switch appropriate tab and language', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>

<js>JS CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></js>
<ts>TS CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></ts>
<java>JAVA CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></java>

::::::::::::
\`\`\`js
<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>
\`\`\`
\`\`\`ts
<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>
\`\`\`
\`\`\`java
<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>
\`\`\`
::::::::::::`)

      zero.config.lang = 'ru'
      zero.config.code = 'ts'
      await zero.render()

      expect(zeroBody$('.inline-content.active').innerText).to.equal('TS CONTENT Привет')
      expect(zeroBody$('.tab-button.active').innerText).to.equal('ts')
      expect(zeroBody$('.tab-content.active').innerText.split('\n')[0]).to.equal('Привет')
    })

    it('values from attributes should override values from ZeroMdConfig' +
    ' AND switch appropriate tab and language', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>

<js>JS CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></js>
<ts>TS CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></ts>
<java>JAVA CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></java>
<py>PYTHON CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></py>

::::::::::::
\`\`\`js
<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>
\`\`\`
\`\`\`ts
<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>
\`\`\`
\`\`\`java
<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>
\`\`\`
\`\`\`py
<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>
\`\`\`
::::::::::::`)

      zero.config.lang = 'ru'
      zero.config.code = 'ts'
      zero.setAttribute('lang', 'en')
      zero.setAttribute('code', 'py')
      await zero.render()

      expect(zeroBody$('.inline-content.active').innerText).to.equal('PYTHON CONTENT Hello')
      expect(zeroBody$('.tab-button.active').innerText).to.equal('py')
      expect(zeroBody$('.tab-content.active').innerText.split('\n')[0]).to.equal('Hello')
    })

    describe('Depending on URLSearchParams behavior testing', () => {
      afterEach(() => {
        window.history.replaceState(null, null, baseUrl);
      })
  
      it('values from URLSearchParams should be the highest priority' +
      ' AND switch appropriate tab and language', async () => {
        zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="java"/>

<java>JAVA CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></java>
<py>PYTHON CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></py>
<cs>CS CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></cs>

::::::::::::
\`\`\`js
<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>
\`\`\`
\`\`\`ts
<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>
\`\`\`
\`\`\`java
<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>
\`\`\`
\`\`\`py
<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>
\`\`\`
\`\`\`cs
<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>
\`\`\`
::::::::::::`)

        zero.config.lang = 'ru'
        zero.config.code = 'ts'
        zero.setAttribute('lang', 'en')
        zero.setAttribute('code', 'py')
        const newQueryString = '?lang=uk&code=cs';
        window.history.pushState(null, null, window.location.href + newQueryString)
        await zero.render()

        expect(zeroBody$('.inline-content.active').innerText).to.equal('CS CONTENT Привіт')
        expect(zeroBody$('.tab-button.active').innerText).to.equal('cs')
        expect(zeroBody$('.tab-content.active').innerText.split('\n')[0]).to.equal('Привіт')
      })
    })
  })
}
