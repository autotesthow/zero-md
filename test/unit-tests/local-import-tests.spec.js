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
  
    describe('Local import testing', () => {
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
      '"{{Review}}", "ru", "py"': {
        whenLang: 'ru',
        whenCode: 'py',
        whatWeUse: '{{Review}}',
        shouldBe: 'Ревью',
      },
      '"{{lang}}", "en", "cs"': {
        whenLang: 'en',
        whenCode: 'cs',
        whatWeUse: '{{lang}}',
        shouldBe: 'C#',
      },
      '"{{NO_CHANGES}}", "uk", "java"': {
        whenLang: 'uk',
        whenCode: 'java',
        whatWeUse: '{{NO_CHANGES}}',
        shouldBe: 'без змін',
      },
    }

    Object.entries(scenarios).forEach((args) => {
      const [
        scenario,
        { only, whenLang: lang, whenCode: code, whatWeUse, shouldBe: text }
      ] = args
      if (only !== undefined && !only) {
        return
      }
      it(`<!--import()--> work with  ${scenario}`, async () => {
        zeroAppendScriptMD(
'<!--import(./variables-for-local-import-tests.md)-->\n'+
`<localized main="${lang}"/>\n`+
`<codalized main="${code}"/>\n` +
'<p>\n'+  
`<uk-en-ru><py-js-ts-java-cs>${whatWeUse}</py-js-ts-java-cs></uk-en-ru>\n` + 
'<p>')
        
        await zero.render()
  
        expect(zeroBody$('p').innerText).to.equals(text)
      })
    })
    
          it(`<!--import()--> work with "{{YOUTUBE()}}", "uk", "java"`, async () => {
            zeroAppendScriptMD(
'<!--import(./variables-for-local-import-tests.md)-->\n'+
'<localized main="uk"/>\n'+
'<codalized main="java"/>\n' +
'<p>\n'+  
`<uk-en-ru><py-js-ts-java-cs>{{YOUTUBE(https://youtu.be/I1SBGzclwE0)}}</py-js-ts-java-cs></uk-en-ru>\n` + 
'<p>')
        
        await zero.render()
  
        expect(zeroBody$('iframe').src).to.equals('https://www.youtube.com/embed/I1SBGzclwE0')
          })
          
          it(`<!--import()--> work with "{{LOOM()}}", "en", "js"`, async () => {
            zeroAppendScriptMD(
'<!--import(./variables-for-local-import-tests.md)-->\n'+
'<localized main="en"/>\n'+
'<codalized main="js"/>\n' +
'<p>\n'+  
`<uk-en-ru><py-js-ts-java-cs>{{LOOM(https://www.loom.com/share/75f1210f206f49348541008c0cf2ad1d)}}</py-js-ts-java-cs></uk-en-ru>\n` + 
'<p>')
        
        await zero.render()
  
        expect(zeroBody$('iframe').src).to.equals('https://www.loom.com/embed/75f1210f206f49348541008c0cf2ad1d')
      })
  })
}
