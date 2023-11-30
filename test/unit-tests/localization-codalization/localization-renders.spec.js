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
  
  const zero$ = (selector) => zero.shadowRoot.querySelector(selector)
  const zeroBody = () => zero$('.markdown-body')
  const zeroBody$ = (selector) => zeroBody().querySelector(selector)

  const zeroAppendScriptMD = (text) => {
    const script = document.createElement('script')
    script.setAttribute('type', 'text/markdown')
    script.text = text
    zero.appendChild(script)
  }

  describe('Localization renders', () => {
    it('does not render lang without localized option', async () => {
      zeroAppendScriptMD(`
<ru>Привет</ru><uk>Привіт</uk><en>Hello</en>`)

      await zero.render()

      expect(zeroBody$('p').innerHTML).to.equal('<ru>Привет</ru><uk>Привіт</uk><en>Hello</en>')
    })
    
    it('lang by main attribute in localized option', async () => {
      zeroAppendScriptMD(`
<localized main="en"/>

<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>`)
      await zero.render()
   
      expect(zeroBody$('localized').innerText).to.equal('Hello')
    })

    it('lang by lang option of zero-md config', async () => {
      zeroAppendScriptMD(`
<localized main="en"/>

<ru>Привет</ru><uk>Привіт</uk><en>Hello</en>`)

      zero.config = { ...zero.config, lang: 'uk' }
      await zero.render()

      expect(zeroBody$('p').innerHTML).to.equal('Привіт')
    })

    it('lang by lang attribute of zero-md', async () => {
      zeroAppendScriptMD(`
<localized main="en"/>

<ru>Привет</ru><uk>Привіт</uk><en>Hello</en>`)

      zero.lang = 'uk'
      await zero.render()

      expect(zeroBody$('p').innerHTML).to.equal('Привіт')
    })

    it('should be overrided from attributes after zero-md config', async () => {
      zeroAppendScriptMD(`
<localized main="en"/>

<uk>Привіт</uk><ru>Привет</ru><en>Hello</en>`)
      zero.config.lang = 'ru'

      zero.setAttribute('lang', 'uk')
      await zero.render()

      expect(zeroBody$('localized').innerText).to.equal('Привіт')
    })

    it('auto re-renders on change of lang attribute of zero-md', async () => {
      zero.remove()
      zero = add('<zero-md lang="en"></zero-md>')
      zeroAppendScriptMD(`
<localized main="en"/>

<ru>Привет</ru><uk>Привіт</uk><en>Hello</en>`)
      await zero.render()

      zero.lang = 'uk'
      await zero.waitForRendered()

      expect(zeroBody$('p').innerHTML).to.equal('Привіт')
    })
  })
}
