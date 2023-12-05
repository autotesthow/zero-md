/* eslint-env mocha */
/* global chai */

import common from './../../utils/common.js'
import { Zero } from '../../utils/Zero.js'

export default function() {
  mocha.setup({
    ui: 'bdd'
  })

  chai.config.truncateThreshold = 0
  const expect = chai.expect

  const zero = new Zero()
  
  describe('Depending on URLSearchParams behavior testing', () => {
    beforeEach(() => {
      zero.addHtml(`<zero-md manual-render></zero-md>`)
    })
    afterEach(() => {
      zero.remove()
      common.clearSearchParams()
    })

    it('should be overrided from URLSearchParams', async () => {
      zero.appendScriptMD(`
<localized main="uk"/>

<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>`)
      
      const queryString = '?lang=en';
      common.setSearchParams(queryString)
      await zero.render()
    
      expect(zero.body$('p').innerText).to.equal('Hello')
    })

    it('should be overrided from URLSearchParams after attributes', async () => {
      zero.appendScriptMD(`
<localized main="en"/>

<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>`)
      zero.setLangByAttribute('ru')

      const queryString = '?lang=uk';
      common.setSearchParams(queryString)
      await zero.render() 
    
      expect(zero.body$('localized').innerText).to.equal('Привіт')
    })

    it('should be overrided from URLSearchParams after zeroMdConfig', async () => {
      zero.appendScriptMD(`
<localized main="en"/>

<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>`)
      zero.setLangByConfig('uk')

      const queryString = '?lang=en';
      common.setSearchParams(queryString)
      await zero.render()
    
      expect(zero.body$('localized').innerText).to.equal('Hello')
    }) 

    it('should be overrided from URLSearchParams', async () => {
      zero.appendScriptMD(`
<codalized main="java"/>

<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>`)

      const queryString = '?code=ts';
      common.setSearchParams(queryString)
      await zero.render()
   
      expect(zero.body$('.inline-content.active').innerText).to.equal('TS')
    })

    it('should be overrided from URLSearchParams after attributes', async () => {
      zero.appendScriptMD(`
<codalized main="java"/>

<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>`) 
      zero.setCodeByAttribute('cs')

      const queryString = '?code=ts';
      common.setSearchParams(queryString)
      await zero.render() 
   
      expect(zero.body$('.inline-content.active').innerText).to.equal('TS')
    })

    it('should be overrided from URLSearchParams after zeroMdConfig', async () => {
      zero.appendScriptMD(`
<codalized main="java"/>

<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>`)
      zero.setCodeByConfig('ts')
      
      const queryString = '?code=py';
      common.setSearchParams(queryString)
      await zero.render() 
   
      expect(zero.body$('.inline-content.active').innerText).to.equal('PY')
    })
  })
}
