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

  beforeEach(() => {
    zero.addHtml(`<zero-md manual-render></zero-md>`)
  })
  afterEach(() => {
    zero.remove()
  })

  describe('With codegroups', () => {
    it('should set lang and code from codalized and localized tag if other options wasn\'t set' +
    ' AND switch appropriate tab and language', async () => {
      zero.appendScriptMdLocalizedCodalized('uk', 'java', `
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

      expect(zero.body$('.inline-content.active').innerText).to.equal('JAVA CONTENT Привіт')
      expect(zero.body$('.tab-button.active').innerText).to.equal('java')
      expect(zero.body$('.tab-content.active').innerText.split('\n')[0]).to.equal('Привіт')
    })

    it('values from ZeroMdConfig should override values from  codalized and localized' +
    ' AND switch appropriate tab and language', async () => {
      zero.appendScriptMdLocalizedCodalized('uk', 'java', `
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

      zero.setLangByConfig('ru')
      zero.setCodeByConfig('ts')
      await zero.render()

      expect(zero.body$('.inline-content.active').innerText).to.equal('TS CONTENT Привет')
      expect(zero.body$('.tab-button.active').innerText).to.equal('ts')
      expect(zero.body$('.tab-content.active').innerText.split('\n')[0]).to.equal('Привет')
    })

    it('values from attributes should override values from ZeroMdConfig' +
    ' AND switch appropriate tab and language', async () => {
      zero.appendScriptMdLocalizedCodalized('uk', 'java', `
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

      zero.setLangByConfig('ru')
      zero.setCodeByConfig('ts')
      zero.setLangByAttribute('en')
      zero.setCodeByAttribute('py')
      await zero.render()

      expect(zero.body$('.inline-content.active').innerText).to.equal('PYTHON CONTENT Hello')
      expect(zero.body$('.tab-button.active').innerText).to.equal('py')
      expect(zero.body$('.tab-content.active').innerText.split('\n')[0]).to.equal('Hello')
    })
  })
  
  describe('Depending on URLSearchParams behavior testing', () => {
    afterEach(() => {
      common.clearSearchParams()
    })

    it('values from URLSearchParams should be the highest priority' +
    ' AND switch appropriate tab and language', async () => {
      zero.appendScriptMdLocalizedCodalized('uk', 'java', `
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

      zero.setLangByConfig('ru')
      zero.setCodeByConfig('ts')
      zero.setLangByAttribute('en')
      zero.setCodeByAttribute('py')
      const newQueryString = '?lang=uk&code=cs';
      common.setSearchParams(newQueryString)
      await zero.render()

      expect(zero.body$('.inline-content.active').innerText).to.equal('CS CONTENT Привіт')
      expect(zero.body$('.tab-button.active').innerText).to.equal('cs')
      expect(zero.body$('.tab-content.active').innerText.split('\n')[0]).to.equal('Привіт')
    })
  })
}
