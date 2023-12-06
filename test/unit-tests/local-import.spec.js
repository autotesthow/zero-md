/* eslint-env mocha */
/* global chai */

import { Zero } from '../utils/Zero.js'

export default function() {
  mocha.setup({
    ui: 'bdd'
  })

  chai.config.truncateThreshold = 0
  const expect = chai.expect

  const zero = new Zero()
  
  describe('Local import', () => {
    beforeEach(() => {
      zero.addHtml(`<zero-md manual-render></zero-md>`)
    })
    afterEach(() => {
      zero.remove()
    })

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

    let isOnly = false
    Object.entries(scenarios).forEach((args) => {
      if (args[1].only) {
        isOnly = true
      }
    })

    Object.entries(scenarios).forEach((args) => {
      const [
        scenario,
        { only, whenLang: lang, whenCode: code, whatWeUse, shouldBe: text }
      ] = args
      if (!only && isOnly) {
        return
      }
      it(`<!--import()--> work with  ${scenario}`, async () => {
        zero.appendScriptMdLocalizedCodalized(lang, code, `
<!--import(./variables-for-local-import-tests.md)-->

<p> 
<uk-en-ru><py-js-ts-java-cs>${whatWeUse}</py-js-ts-java-cs></uk-en-ru>
<p>`)
        
        await zero.render()
  
        expect(zero.body$('p').innerText).to.equals(text)
      })
    })
    
    it.skip(`<!--import()--> work in variables`, async () => {
      zero.appendScriptMdLocalizedCodalized('en', 'js', `
<!--import(./variables-for-local-import-tests.md)-->
<!----js~{{var}}~({{lang}}) good job~-->

<p> 
<uk-en-ru><py-js-ts-java-cs>{{var}}</py-js-ts-java-cs></uk-en-ru>
<p>`)
        
      await zero.render()

      expect(zero.body$('p').innerText).to.equals('JavaScript good job')
    })

    it(`<!--import()--> work with "{{YOUTUBE()}}", "uk", "java"`, async () => {
      zero.appendScriptMdLocalizedCodalized('uk', 'java', `
<!--import(./variables-for-local-import-tests.md)-->

<p>  
<uk-en-ru><py-js-ts-java-cs>{{YOUTUBE(https://youtu.be/I1SBGzclwE0)}}</py-js-ts-java-cs></uk-en-ru>
<p>`)
        
      await zero.render()

      expect(zero.body$('iframe').src).to.equals('https://www.youtube.com/embed/I1SBGzclwE0')
    })
          
    it(`<!--import()--> work with "{{LOOM()}}", "en", "js"`, async () => {
      zero.appendScriptMdLocalizedCodalized('en', 'js', `
<!--import(./variables-for-local-import-tests.md)-->

<p>
<uk-en-ru><py-js-ts-java-cs>{{LOOM(https://www.loom.com/share/75f1210f206f49348541008c0cf2ad1d)}}</py-js-ts-java-cs></uk-en-ru>
<p>`)
        
      await zero.render()

      expect(zero.body$('iframe').src).to.equals('https://www.loom.com/embed/75f1210f206f49348541008c0cf2ad1d')
    })

    //TODO make it pass 
    it.skip('import one translation variable work in one translation variable', async () => {
      zero.appendScriptMdLocalizedCodalized('en', 'js', `
<!--import(./variables-for-local-import-tests.md)-->
<!----js~{{js-lang}}~{{one-lang-from-import}} language~-->

<p>
<uk-en-ru><py-js-ts-java-cs>{{js-lang}}</py-js-ts-java-cs></uk-en-ru>
<p>`)
      
      await zero.render()

      expect(zero.body$('p').innerText).to.equals('JavaScript language')
    })

    it('import general translation variable work in one translation variable', async () => {
      zero.appendScriptMdLocalizedCodalized('en', 'js', `
<!--import(./variables-for-local-import-tests.md)-->
<!----js~{{one-lang}}~{{general-lang-from-import}} language~-->

<p>
<uk-en-ru><py-js-ts-java-cs>{{one-lang}}</py-js-ts-java-cs></uk-en-ru>
<p>`)
      
      await zero.render()

      expect(zero.body$('p').innerText).to.equals('Any language')
    })

    it('import one translation variable work in general translation variable', async () => {
      zero.appendScriptMdLocalizedCodalized('en', 'js', `
<!--import(./variables-for-local-import-tests.md)-->
<!--~{{general-lang}}~{{one-lang-from-import}} language~-->

<p>
<uk-en-ru><py-js-ts-java-cs>{{general-lang}}</py-js-ts-java-cs></uk-en-ru>
<p>`)
      
      await zero.render()

      expect(zero.body$('p').innerText).to.equals('JavaScript language')
    })

    it('import general translation variable work in general translation variable', async () => {
      zero.appendScriptMdLocalizedCodalized('en', 'js', `
<!--import(./variables-for-local-import-tests.md)-->
<!--~{{general-lang}}~{{general-lang-from-import}} language~-->

<p>
<uk-en-ru><py-js-ts-java-cs>{{general-lang}}</py-js-ts-java-cs></uk-en-ru>
<p>`)
      
      await zero.render()

      expect(zero.body$('p').innerText).to.equals('Any language')
    })

    it('import one translation variable dont work in general translation variable with wrong code language', async () => {
      zero.appendScriptMdLocalizedCodalized('en', 'py', `
<!--import(./variables-for-local-import-tests.md)-->
<!--~{{general-lang}}~{{one-lang-from-import}} language~-->

<p>
<uk-en-ru><py-js-ts-java-cs>{{general-lang}}</py-js-ts-java-cs></uk-en-ru>
<p>`)
      
      await zero.render()

      expect(zero.body$('p').innerText).to.equals('{{one-lang-from-import}} language')
    })
  })
}
