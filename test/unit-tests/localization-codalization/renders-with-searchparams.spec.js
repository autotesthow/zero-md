/* eslint-env mocha */
/* global chai */

import common from './../../utils/common.js'

export default function() {
  mocha.setup({
    ui: 'bdd'
  })

  chai.config.truncateThreshold = 0
  const expect = chai.expect

  let zero
  beforeEach(() => {
    zero = common.addHtml(`<zero-md manual-render></zero-md>`)
  })
  afterEach(() => {
    zero.remove()
    common.clearSearchParams(baseUrl)
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
    it('should be overrided from URLSearchParams', async () => {
      zeroAppendScriptMD(`
<localized main="uk"/>

<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>`)
      
      const queryString = '?lang=en';
      common.setSearchParams(baseUrl, queryString)
      await zero.render()
    
      expect(zeroBody$('p').innerText).to.equal('Hello')
    })

    it('should be overrided from URLSearchParams after attributes', async () => {
      zeroAppendScriptMD(`
<localized main="en"/>

<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>`)
      zero.setAttribute('lang', 'ru')

      const queryString = '?lang=uk';
      common.setSearchParams(baseUrl, queryString)
      await zero.render() 
    
      expect(zeroBody$('localized').innerText).to.equal('Привіт')
    })

    it('should be overrided from URLSearchParams after zeroMdConfig', async () => {
      zeroAppendScriptMD(`
<localized main="en"/>

<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>`)
      zero.config.lang = 'uk'

      const queryString = '?lang=en';
      common.setSearchParams(baseUrl, queryString)
      await zero.render()
    
      expect(zeroBody$('localized').innerText).to.equal('Hello')
    }) 

    it('should be overrided from URLSearchParams', async () => {
      zeroAppendScriptMD(`
<codalized main="java"/>

<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>`)

      const queryString = '?code=ts';
      common.setSearchParams(baseUrl, queryString)
      await zero.render()
   
      expect(zeroBody$('.inline-content.active').innerText).to.equal('TS')
    })

    it('should be overrided from URLSearchParams after attributes', async () => {
      zeroAppendScriptMD(`
<codalized main="java"/>

<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>`) 
      zero.setAttribute('code', 'cs')

      const queryString = '?code=ts';
      common.setSearchParams(baseUrl, queryString)
      await zero.render() 
   
      expect(zeroBody$('.inline-content.active').innerText).to.equal('TS')
    })

    it('should be overrided from URLSearchParams after zeroMdConfig', async () => {
      zeroAppendScriptMD(`
<codalized main="java"/>

<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>`)
      zero.config.code = 'ts'
      
      const queryString = '?code=py';
      common.setSearchParams(baseUrl, queryString)
      await zero.render() 
   
      expect(zeroBody$('.inline-content.active').innerText).to.equal('PY')
    })
  })
}
