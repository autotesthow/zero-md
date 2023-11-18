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
}
