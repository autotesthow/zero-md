/* eslint-env mocha */
/* global chai */

import { Zero } from '../../utils/Zero.js'

export default function() {
  mocha.setup({
    ui: 'bdd'
  })

  chai.config.truncateThreshold = 0
  const expect = chai.expect
  
  const zero = new Zero()

  describe('Localization renders', () => {
    beforeEach(() => {
      zero.addHtml(`<zero-md manual-render></zero-md>`)
    })
    afterEach(() => {
      zero.remove()
    })

    it('does not render lang without localized option', async () => {
      zero.appendScriptMD(`
<ru>Привет</ru><uk>Привіт</uk><en>Hello</en>`)

      await zero.render()

      expect(zero.body$('p').innerHTML).to.equal('<ru>Привет</ru><uk>Привіт</uk><en>Hello</en>')
    })
    
    it('lang by main attribute in localized option', async () => {
      zero.appendScriptMD(`
<localized main="en"/>

<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>`)
      await zero.render()
   
      expect(zero.body$('localized').innerText).to.equal('Hello')
    })

    it('lang by lang option of zero-md config', async () => {
      zero.appendScriptMD(`
<localized main="en"/>

<ru>Привет</ru><uk>Привіт</uk><en>Hello</en>`)

      zero.setLangByConfig('ru')
      await zero.render()

      expect(zero.body$('p').innerHTML).to.equal('Привет')
    })

    it('lang by lang attribute of zero-md', async () => {
      zero.appendScriptMD(`
<localized main="en"/>

<ru>Привет</ru><uk>Привіт</uk><en>Hello</en>`)

      zero.setLangByAttribute('uk')
      await zero.render()

      expect(zero.body$('p').innerHTML).to.equal('Привіт')
    })

    it('should be overrided from attributes after zero-md config', async () => {
      zero.appendScriptMD(`
<localized main="en"/>

<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>`)
      zero.setLangByConfig('ru')

      zero.setLangByAttribute('uk')
      await zero.render()

      expect(zero.body$('localized').innerText).to.equal('Привіт')
    })

    it('auto re-renders on change of lang attribute of zero-md', async () => {
      zero.remove()
      zero.addHtml('<zero-md lang="ru"></zero-md>')
      zero.appendScriptMD(`
<localized main="en"/>

<ru>Привет</ru><uk>Привіт</uk><en>Hello</en>`)
      await zero.render()

      zero.setLangByAttribute('uk')
      await zero.get().waitForRendered()

      expect(zero.body$('p').innerHTML).to.equal('Привіт')
    })
  })
}
