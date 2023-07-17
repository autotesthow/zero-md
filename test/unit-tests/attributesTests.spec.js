/* eslint-env mocha */
/* global chai */

export default function() {
  mocha.setup({
    ui: 'bdd'
  })

  chai.config.truncateThreshold = 0
  const assert = chai.assert

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

  const zero$ = (selector) => zero.shadowRoot.querySelector(selector)
  const zeroBody = () => zero$('.markdown-body')
  const zeroBody$ = (selector) => zeroBody().querySelector(selector)

  const zeroAppendScriptMD = (text) => {
    const script = document.createElement('script')
    script.setAttribute('type', 'text/markdown')
    script.text = text
    zero.appendChild(script)
  }

  describe('Localization testing', () => {
    it('should load lang from <localized main="..."/ inside MD>', async () => {
      zeroAppendScriptMD('<localized main="en"/><uk>Привіт</uk><ru>Привет</ru><en>Hello</en>')
      
      await zero.render()
   
      assert(zeroBody$('localized').innerText === 'Hello')
    })

    it('should load lang from ZeroMdConfig', async () => {
      zeroAppendScriptMD('<localized main="en"/><uk>Привіт</uk><ru>Привет</ru><en>Hello</en>')

      zero.config.lang = 'uk'
      await zero.render()
   
      assert(zeroBody$('p').innerText === 'Привіт')
    })

    it('should load lang from attributes', async () => {
      zeroAppendScriptMD('<localized main="en"/><uk>Привіт</uk><ru>Привет</ru><en>Hello</en>')

      zero.setAttribute('lang', 'ru')
      await zero.render()
   
      assert(zeroBody$('p').innerText === 'Привет')
    })

    it('valuе from ZeroMdConfig should override value from <localized main="..."/>', async () => {
      zeroAppendScriptMD('<localized main="en"/><uk>Привіт</uk><ru>Привет</ru><en>Hello</en>')

      zero.config.lang = 'ru'
      await zero.render() 
   
      assert(zeroBody$('localized').innerText === 'Привет')
    })

    it('valuе from attributes should override value from ZeroMdConfig', async () => {
      zeroAppendScriptMD('<localized main="en"/><uk>Привіт</uk><ru>Привет</ru><en>Hello</en>')

      zero.config.lang = 'ru'
      zero.setAttribute('lang', 'uk')
      await zero.render() 
   
      assert(zeroBody$('localized').innerText === 'Привіт')
    })
  })

  describe('Codalization testing', () => {
    it('should load code from <codalized main="..."/ inside MD>', async () => {
      zeroAppendScriptMD('<codalized main="java"/>' +
      '<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>')
      
      await zero.render()
   
      assert(zeroBody$('.inline-content.active').innerText === 'JAVA')
    })

    it('should load code from ZeroMdConfig', async () => {
      zeroAppendScriptMD('<codalized main="java"/><js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>')

      zero.config.code = 'py'
      await zero.render()
   
      assert(zeroBody$('.inline-content.active').innerText === 'PY')
    })

    it('should load code from attributes', async () => {
      zeroAppendScriptMD('<codalized main="java"/><js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>')

      zero.setAttribute('code', 'cs')
      await zero.render()
   
      assert(zeroBody$('.inline-content.active').innerText === 'CS')
    })

    it('valuе from ZeroMdConfig should override value from <codalized main="..."/>', async () => {
      zeroAppendScriptMD('<codalized main="java"/>' +
      '<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>')

      zero.config.code = 'py'
      await zero.render()
   
      assert(zeroBody$('.inline-content.active').innerText === 'PY')
    })

    it('valuе from attributes should override value from ZeroMdConfig', async () => {
      zeroAppendScriptMD('<codalized main="java"/>' +
      '<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>')
     
      zero.config.code = 'py'
      zero.setAttribute('code', 'cs')
      await zero.render()
   
      assert(zeroBody$('.inline-content.active').innerText === 'CS')
    })
  })

  describe('Localization and codalization with codegroups testing', () => {
    it('should set lang and code from codalized аnd localized tag if other options wasn\'t set' +
    ' AND switch appropriate tab and language', async () => {
      zeroAppendScriptMD('<localized main="uk"/>\n' +
      '<codalized main="java"/>\n' +
      '<js>JS CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></js>\n' +
      '<ts>TS CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></ts>\n' +
      '<java>JAVA CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></java>\n' +
      '\n' +
      '::::::::::::\n' +
      '```js\n' +
      '<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>\n' +
      '```\n' +
      '```ts\n' +
      '<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>\n' +
      '```\n' +
      '```java\n' +
      '<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>\n' +
      '```\n' +
      '::::::::::::\n' 
      )

      await zero.render()

      assert(zeroBody$('.inline-content.active').innerText === 'JAVA CONTENT Привіт')
      assert(zeroBody$('.tab-button.active').innerText === 'java')
      assert(zeroBody$('.tab-content.active').innerText.split('\n')[0] === 'Привіт')
    })

    it('values from ZeroMdConfig should override values from  codalized аnd localized' +
    ' AND switch appropriate tab and language', async () => {
      zeroAppendScriptMD('<localized main="uk"/>\n' +
      '<codalized main="java"/>\n' +
      '<js>JS CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></js>\n' +
      '<ts>TS CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></ts>\n' +
      '<java>JAVA CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></java>\n' +
      '\n' +
      '::::::::::::\n' +
      '```js\n' +
      '<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>\n' +
      '```\n' +
      '```ts\n' +
      '<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>\n' +
      '```\n' +
      '```java\n' +
      '<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>\n' +
      '```\n' +
      '::::::::::::\n' 
      )

      zero.config.lang = 'ru'
      zero.config.code = 'ts'
      await zero.render()

      assert(zeroBody$('.inline-content.active').innerText === 'TS CONTENT Привет')
      assert(zeroBody$('.tab-button.active').innerText === 'ts')
      assert(zeroBody$('.tab-content.active').innerText.split('\n')[0] === 'Привет')
    })

    it('values from attributes should override values from ZeroMdConfig' +
    ' AND switch appropriate tab and language', async () => {
      zeroAppendScriptMD('<localized main="uk"/>\n' +
      '<codalized main="java"/>\n' +
      '<js>JS CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></js>\n' +
      '<ts>TS CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></ts>\n' +
      '<java>JAVA CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></java>\n' +
      '<py>PYTHON CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></py>\n' +
      '\n' +
      '::::::::::::\n' +
      '```js\n' +
      '<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>\n' +
      '```\n' +
      '```ts\n' +
      '<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>\n' +
      '```\n' +
      '```java\n' +
      '<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>\n' +
      '```\n' +
      '```py\n' +
      '<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>\n' +
      '```\n' +
      '::::::::::::\n' 
      )

      zero.config.lang = 'ru'
      zero.config.code = 'ts'
      zero.setAttribute('lang', 'en')
      zero.setAttribute('code', 'py')
      await zero.render()

      assert(zeroBody$('.inline-content.active').innerText === 'PYTHON CONTENT Hello')
      assert(zeroBody$('.tab-button.active').innerText === 'py')
      assert(zeroBody$('.tab-content.active').innerText.split('\n')[0] === 'Hello')
    })
  })

  describe('Depending on URLSearchParams behavior testing', () => {
    let baseUrl = window.location.href
    afterEach(() => {
      window.history.replaceState(null, null, baseUrl);
    })

    it('should load lang from URLSerachParams>', async () => {
      zeroAppendScriptMD('<localized main="uk"/><uk>Привіт</uk><ru>Привет</ru><en>Hello</en>')
      
      const newQueryString = '?lang=en';
      window.history.pushState(null, null, baseUrl + newQueryString)
      await zero.render()
   
      assert(zeroBody$('p').innerText === 'Hello')
    })

    it('lang valuе from URLSerachParams should override value from attributes', async () => {
      zeroAppendScriptMD('<localized main="en"/><uk>Привіт</uk><ru>Привет</ru><en>Hello</en>')

      zero.setAttribute('lang', 'ru')
      const newQueryString = '?lang=uk';
      window.history.pushState(null, null, baseUrl + newQueryString)
      await zero.render() 
   
      assert(zeroBody$('localized').innerText === 'Привіт')
    })

    it('should choose the most preferred lang option', async () => {
      zeroAppendScriptMD('<localized main="en"/><uk>Привіт</uk><ru>Привет</ru><en>Hello</en>')

      zero.config.lang = 'uk'
      zero.setAttribute('lang', 'ru')
      const newQueryString = '?lang=en';
      window.history.pushState(null, null, baseUrl + newQueryString)
      await zero.render() 
   
      assert(zeroBody$('localized').innerText === 'Hello')
    })

    it('should load code from URLSerachParams', async () => {
      zeroAppendScriptMD('<codalized main="java"/><js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>')

      const newQueryString = '?code=ts';
      window.history.pushState(null, null, baseUrl + newQueryString)
      await zero.render()
   
      assert(zeroBody$('.inline-content.active').innerText === 'TS')
    })

    it('code valuе from URLSerachParams should override value from attributes', async () => {
      zeroAppendScriptMD('<codalized main="java"/>' +
      '<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>')
      
      zero.setAttribute('code', 'cs')
      const newQueryString = '?code=ts';
      window.history.pushState(null, null, baseUrl + newQueryString)
      await zero.render() 
   
      assert(zeroBody$('.inline-content.active').innerText === 'TS')
    })

    it('should choose the most preferred code option', async () => {
      zeroAppendScriptMD('<codalized main="java"/>' +
      '<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>')

      zero.config.code = 'ts'
      zero.setAttribute('code', 'cs')
      const newQueryString = '?code=py';
      window.history.pushState(null, null, baseUrl + newQueryString)
      await zero.render() 
   
      assert(zeroBody$('.inline-content.active').innerText === 'PY')
    })

    it('values from URLSerachParams should be the highest priority' +
    ' AND switch appropriate tab and language', async () => {
      zeroAppendScriptMD('<localized main="uk"/>\n' +
      '<codalized main="java"/>\n' +
      '<js>JS CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></js>\n' +
      '<ts>TS CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></ts>\n' +
      '<java>JAVA CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></java>\n' +
      '<py>PYTHON CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></py>\n' +
      '<cs>CS CONTENT <uk>Привіт</uk><ru>Привет</ru><en>Hello</en></cs>\n' +
      '\n' +
      '::::::::::::\n' +
      '```js\n' +
      '<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>\n' +
      '```\n' +
      '```ts\n' +
      '<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>\n' +
      '```\n' +
      '```java\n' +
      '<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>\n' +
      '```\n' +
      '```py\n' +
      '<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>\n' +
      '```\n' +
      '```cs\n' +
      '<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>\n' +
      '```\n' +
      '::::::::::::\n'
      )

      zero.config.lang = 'ru'
      zero.config.code = 'ts'
      zero.setAttribute('lang', 'en')
      zero.setAttribute('code', 'py')
      const newQueryString = '?lang=uk&code=cs';
      window.history.pushState(null, null, window.location.href + newQueryString)
      await zero.render()

      assert(zeroBody$('.inline-content.active').innerText === 'CS CONTENT Привіт')
      assert(zeroBody$('.tab-button.active').innerText === 'cs')
      assert(zeroBody$('.tab-content.active').innerText.split('\n')[0] === 'Привіт')
    })
  })
}
