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

  describe('With codegroups', () => {
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
}
