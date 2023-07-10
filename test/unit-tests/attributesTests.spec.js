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

  describe('LOCALIZATION testing', () => {
    it('should change lang from <localized main="..."/ inside MD>', async () => {
      zeroAppendScriptMD('<localized main="en"/><uk>Привіт</uk><ru>Привет</ru><en>Hello</en>')
      
      await zero.render()
   
      assert(zeroBody$('localized').innerText === 'Hello')
    })

    it('should change lang from ZeroMdConfig>', async () => {
      zeroAppendScriptMD('<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>')

      zero.config.lang = 'uk'
      await zero.render()
   
      assert(zeroBody$('p').innerText === 'Привіт')
    })

    it('should change lang from ATTRIBUTES>', async () => {
      zeroAppendScriptMD('<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>')

      zero.setAttribute('lang', 'ru')
      await zero.render()
   
      assert(zeroBody$('p').innerText === 'Привет')
    })

    it('should change lang from URLSerachParams>', async () => {
      zeroAppendScriptMD('<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>')
      
      let baseUrl = window.location.href.split('?')[0];
      const newQueryString = '?lang=en';
      window.history.pushState(null, null, baseUrl + newQueryString)
      await zero.render()
   
      assert(zeroBody$('p').innerText === 'Hello')
      window.history.replaceState(null, null, baseUrl);
    })

    it('valuе from ZeroMdConfig should override value from <localized main="..."/>', async () => {
      zeroAppendScriptMD('<localized main="en"/><uk>Привіт</uk><ru>Привет</ru><en>Hello</en>')

      zero.config.lang = 'ru'
      await zero.render() 
   
      assert(zeroBody$('localized').innerText === 'Привет')
    })

    it('valuе from ATTRIBUTES should override value from ZeroMdConfig', async () => {
      zeroAppendScriptMD('<localized main="en"/><uk>Привіт</uk><ru>Привет</ru><en>Hello</en>')

      zero.config.lang = 'ru'
      zero.setAttribute('lang', 'uk')
      await zero.render() 
   
      assert(zeroBody$('localized').innerText === 'Привіт')
    })

    it('valuе from URLSerachParams should override value from ATTRIBUTES', async () => {
      zeroAppendScriptMD('<localized main="en"/><uk>Привіт</uk><ru>Привет</ru><en>Hello</en>')

      zero.setAttribute('lang', 'ru')
      let baseUrl = window.location.href.split('?')[0];
      const newQueryString = '?lang=uk';
      window.history.pushState(null, null, baseUrl + newQueryString)
      await zero.render() 
   
      assert(zeroBody$('localized').innerText === 'Привіт')
      window.history.replaceState(null, null, baseUrl);
    })

    it('should choose the most preferred option', async () => {
      zeroAppendScriptMD('<localized main="en"/><uk>Привіт</uk><ru>Привет</ru><en>Hello</en>')

      zero.config.lang = 'uk'
      zero.setAttribute('lang', 'ru')
      let baseUrl = window.location.href.split('?')[0];
      const newQueryString = '?lang=en';
      window.history.pushState(null, null, baseUrl + newQueryString)
      await zero.render() 
   
      assert(zeroBody$('localized').innerText === 'Hello')
      window.history.replaceState(null, null, baseUrl);
    })
  })

  describe('CODALIZATION testing', () => {
    it('should change code from <codalized main="..."/ inside MD>', async () => {
      zeroAppendScriptMD('<codalized main="java"/>' +
      '<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>')
      
      await zero.render()
   
      assert(zeroBody$('.inline-content.active').innerText === 'JAVA')
    })

    it('should change code from ZeroMdConfig>', async () => {
      zeroAppendScriptMD('<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>')

      zero.config.code = 'py'
      await zero.render()
   
      assert(zeroBody$('.inline-content.active').innerText === 'PY')
    })

    it('should change code from ATTRIBUTES>', async () => {
      zeroAppendScriptMD('<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>')

      zero.setAttribute('code', 'cs')
      await zero.render()
   
      assert(zeroBody$('.inline-content.active').innerText === 'CS')
    })

    it('should change code from URLSerachParams>', async () => {
      zeroAppendScriptMD('<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>')

      let baseUrl = window.location.href.split('?')[0];
      const newQueryString = '?code=ts';
      window.history.pushState(null, null, baseUrl + newQueryString)
      await zero.render()
   
      assert(zeroBody$('.inline-content.active').innerText === 'TS')
      window.history.replaceState(null, null, baseUrl);
    })

    it('valuе from ZeroMdConfig should override value from <codalized main="..."/>', async () => {
      zeroAppendScriptMD('<codalized main="java"/>' +
      '<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>')

      zero.config.code = 'py'
      await zero.render()
   
      assert(zeroBody$('.inline-content.active').innerText === 'PY')
    })

    it('valuе from ATTRIBUTES should override value from ZeroMdConfig', async () => {
      zeroAppendScriptMD('<codalized main="java"/>' +
      '<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>')
     
      zero.config.code = 'py'
      zero.setAttribute('code', 'cs')
      await zero.render()
   
      assert(zeroBody$('.inline-content.active').innerText === 'CS')
    })

    it('valuе from URLSerachParams should override value from ATTRIBUTES', async () => {
      zeroAppendScriptMD('<codalized main="java"/>' +
      '<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>')
      
      zero.setAttribute('code', 'cs')
      let baseUrl = window.location.href.split('?')[0];
      const newQueryString = '?code=ts';
      window.history.pushState(null, null, baseUrl + newQueryString)
      await zero.render() 
   
      assert(zeroBody$('.inline-content.active').innerText === 'TS')
      window.history.replaceState(null, null, baseUrl);
    })

    it('should choose the most preferred option', async () => {
      zeroAppendScriptMD('<codalized main="java"/>' +
      '<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>')

      zero.config.code = 'ts'
      zero.setAttribute('code', 'cs')
      let baseUrl = window.location.href.split('?')[0];
      const newQueryString = '?code=py';
      window.history.pushState(null, null, baseUrl + newQueryString)
      await zero.render() 
   
      assert(zeroBody$('.inline-content.active').innerText === 'PY')
      window.history.replaceState(null, null, baseUrl);
    })
  })

  describe(' LOCALIZATION and CODALIZATION with CODEGROUPS testing', () => {

    it('should set LANG and CODE from CODALIZED аnd LOCALIZED tag if other options wasn\'t set' +
    ' AND switch appropriate TAB and LANGUAGE', async () => {
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

    it('values from ZeroMdConfig should override values from  CODALIZED аnd LOCALIZED' +
    ' AND switch appropriate TAB and LANGUAGE', async () => {
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

    it('values from ATTRIBUTES should override values from ZeroMdConfig' +
    ' AND switch appropriate TAB and LANGUAGE', async () => {
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

    it('values from URLSerachParams should be the highest priority' +
    ' AND switch appropriate TAB and LANGUAGE', async () => {
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
      let baseUrl = window.location.href.split('?')[0];
      const newQueryString = '?lang=uk&code=cs';
      window.history.pushState(null, null, baseUrl + newQueryString)

      await zero.render()

      assert(zeroBody$('.inline-content.active').innerText === 'CS CONTENT Привіт')
      assert(zeroBody$('.tab-button.active').innerText === 'cs')
      assert(zeroBody$('.tab-content.active').innerText.split('\n')[0] === 'Привіт')
      window.history.replaceState(null, null, baseUrl);
    })
  })
}
