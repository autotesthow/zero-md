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

  describe('Align translations for easier refactoring', () => {
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

    let scenarios = {
      '"en", "py"': {
        dashes: '--',
        whenLang: 'en',
        whenCode: 'py',
        shouldBe: 'Header browser.config.base_url PY any text',
      },
      '"uk", "java"': {
        dashes: '---',
        whenLang: 'uk',
        whenCode: 'java',
        shouldBe: 'Заголовок Configuration.baseUrl JAVA будь який текст',
      },
      '"uk", "cs"': {
        dashes: '----------------',
        whenLang: 'uk',
        whenCode: 'cs',
        shouldBe: 'Заголовок Configuration.BaseUrl CS будь який текст',
      },
    }

    let isOnly = false
    Object.entries(scenarios).forEach((args) => {
      if (args[1].only) {
        isOnly = true
      }
    })

    Object.entries(scenarios).forEach((args) => {
      const [
        scenario,
        { only, dashes, whenLang: lang, whenCode: code, shouldBe: text }
      ] = args
      if (!only && isOnly) {
        return
      }
      it(`${dashes} work with  ${scenario}`, async () => {
        zeroAppendScriptMD(`
<localized main="uk"/>
<codalized main="js"/>   
<!${dashes}js-ts~{{browser.config.baseUrl}}~browser.config.baseUrl~-->
<!${dashes}py~{{browser.config.baseUrl}}~browser.config.base_url~-->
<!${dashes}java~{{browser.config.baseUrl}}~Configuration.baseUrl~-->
<!${dashes}cs~{{browser.config.baseUrl}}~Configuration.BaseUrl~-->

<en>Header <py>{{browser.config.baseUrl}} PY</py><java>{{browser.config.baseUrl}} JAVA</java><js>{{browser.config.baseUrl}} JS</js>
<ts>{{browser.config.baseUrl}} TS</ts><cs>{{browser.config.baseUrl}} CS</cs> any text</en>

<uk>Заголовок <py>{{browser.config.baseUrl}} PY</py><java>{{browser.config.baseUrl}} JAVA</java><js>{{browser.config.baseUrl}} JS</js>
<ts>{{browser.config.baseUrl}} TS</ts><cs>{{browser.config.baseUrl}} CS</cs> будь який текст</uk>

<ru>Заглавие <py>{{browser.config.baseUrl}} PY</py><java>{{browser.config.baseUrl}} JAVA</java><js>{{browser.config.baseUrl}} JS</js>
<ts>{{browser.config.baseUrl}} TS</ts><cs>{{browser.config.baseUrl}} CS</cs> любой текст</ru>`)
        zero.lang = lang
        zero.code = code
        
        await zero.render()
  
        expect(zeroBody$('p').innerText).to.equals(text)
      })
    }) 
  })
}
