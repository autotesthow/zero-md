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
  
  describe('Inline/multiline', () => {
    beforeEach(() => {
      zero.addHtml(`<zero-md manual-render></zero-md>`)
    })
    afterEach(() => {
      zero.remove()
    })
  
    let scenarios = {
      'inline localization': {
        given: 'Hello in selected language - «<ru>Привет</ru><uk>Привіт</uk><en>Hello</en>».',
        whenLang: 'uk',
        selector: 'p',
        shouldBe: 'Hello in selected language - «Привіт».'
      },
      'inline codalization': {
        given: 'Test Runner - <js>jest</js><py>pytest</py>.',
        whenCode: 'py',
        selector: 'p span.active',
        shouldBe: 'pytest'
      },
      'inline codalization with "python" tag': {
        given: 'Test Runner - <js>jest</js><python>pytest</python>.',
        whenCode: 'py',
        selector: 'p span.active',
        shouldBe: 'pytest'
      },
      'inline codalization inverted via not- (js from <js>...<not-js>...)': {
        given: 'Test Runner - <js>jest</js><not-js>pytest</not-js>',
        whenCode: 'js',
        selector: 'p span.active',
        shouldBe: 'jest'
      },
      'inline codalization inverted via not- (ts from <js-ts>...<not-js>...)': {
        given: 'Test Runner - <js-ts>jest</js-ts><not-js>pytest</not-js>',
        whenCode: 'ts',
        selector: 'p',
        shouldBe:
          'Test Runner - ' +
          '<span class="inline-content active" id="js-ts">jest</span>' +
          '<span class="inline-content active" id="not-js">pytest</span>'
      }, // TODO: is such behaviour correct?
      'inline codalization inverted via not- (py from <js-ts>...<not-js-ts>...)': {
        given: 'Test Runner - <js-ts>jest</js-ts><not-js-ts>pytest</not-js-ts>',
        whenCode: 'py',
        selector: 'p span.active',
        shouldBe: 'pytest'
      },
      'inline codalization inverted via not- (py from <js>...<not-js>...)': {
        given: 'Test Runner - <js>jest</js><not-js>pytest</not-js>',
        whenCode: 'py',
        selector: 'p span.active',
        shouldBe: 'pytest'
      },
      'inline codalization inverted via not- (java from <js>...<not-js>...)': {
        given: 'Test Runner - <js>jest</js><not-js>pytest</not-js>',
        whenCode: 'java',
        selector: 'p span.active',
        shouldBe: 'pytest'
      },
      'inline multi-codalization (ts from <js-ts>...<py>...)': {
        given: 'Test Runner - <js-ts>jest</js-ts><py>pytest</py>.',
        whenCode: 'ts',
        selector: 'p span.active',
        shouldBe: 'jest'
      },
      'inline multi-codalization (js from <js-ts>...<py>...)': {
        given: 'Test Runner - <js-ts>jest</js-ts><py>pytest</py>.',
        whenCode: 'js',
        selector: 'p span.active',
        shouldBe: 'jest'
      },
      'inline multi-codalization (py from <js-ts>...<py>...)': {
        given: 'Test Runner - <js-ts>jest</js-ts><py>pytest</py>.',
        whenCode: 'py',
        selector: 'p span.active',
        shouldBe: 'pytest'
      },
      'inline multi-localization (ru from <ru-uk>...<en>...)': {
        given: 'Hello in selected language - «<ru-uk>Здоров</ru-uk><en>Hello</en>».',
        whenLang: 'ru',
        selector: 'p',
        shouldBe: 'Hello in selected language - «Здоров».'
      },
      'inline multi-localization (uk from <ru-uk>...<en>...)': {
        given: 'Hello in selected language - «<ru-uk>Здоров</ru-uk><en>Hello</en>».',
        whenLang: 'uk',
        selector: 'p',
        shouldBe: 'Hello in selected language - «Здоров».'
      },
      'inline multi-localization (en from <ru-uk>...<en>...)': {
        given: 'Hello in selected language - «<ru-uk>Здоров</ru-uk><en>Hello</en>».',
        whenLang: 'en',
        selector: 'p',
        shouldBe: 'Hello in selected language - «Hello».'
      },
      'of multiline localizations with tags on same line': {
        given: `
<ru>Привет</ru>
<uk>Привіт</uk>
<en>Hello</en>`,
        whenLang: 'uk',
        selector: 'p',
        shouldBe: 'Привіт'
      },
      'of multiline localizations (tags on different lines)': {
        given: `
<ru>
Привет
</ru>
<uk>
Привіт
</uk>
<en>
Hello
</en>`,
        whenLang: 'uk',
        selector: 'p',
        shouldBe: 'Привіт'
      },
      'of multiline codalizations with nested localizations (tags on different lines), changed "py" tag to "python" tag': {
        given: `
<js-ts>
<ru-uk>
Тест ранер Jest
</ru-uk>
<en>
Test Runner Jest
</en>
</js-ts>
<python>
<ru-uk>
Тест ранер Pytest
</ru-uk>
<en>
Test Runner Pytest
</en>
</python>`,
        whenLang: 'uk',
        whenCode: 'py',
        selector: '.active p',
        shouldBe: 'Тест ранер Pytest'
      },
      'of multiline codalizations with nested localizations with CODE-translations (tags on different lines)':
        {
          given: `
<!--js~{{TR}}~Jest~-->
<!--ts~{{TR}}~Jest~-->
<!--py~{{TR}}~Pytest~-->

<js-ts>
<ru-uk>
Тест ранер {{TR}}
</ru-uk>
<en>
Test Runner {{TR}}
</en>
</js-ts>
<py>
<ru-uk>
Тест ранер {{TR}}
</ru-uk>
<en>
Test Runner {{TR}}
</en>
</py>`,
          whenLang: 'uk',
          whenCode: 'py',
          selector: '.active p',
          shouldBe: 'Тест ранер Pytest'
        },
      'of multiline codalizations with nested localizations with LANG-translations (tags on different lines), changed "py" tag to "python" tag':
        {
          given: `
<!--ru~{{Test}}~Тест~-->
<!--uk~{{Test}}~Тест~-->
<!--en~{{Test}}~Test~-->

<js-ts>
<ru-uk>
{{Test}} ранер Jest
</ru-uk>
<en>
{{Test}} Runner Jest
</en>
</js-ts>
<python>
<ru-uk>
{{Test}} ранер Pytest
</ru-uk>
<en>
{{Test}} Runner Pytest
</en>
</python>`,
          whenLang: 'uk',
          whenCode: 'py',
          selector: '.active p',
          shouldBe: 'Тест ранер Pytest'
        }
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
        { only, given, whenLang: lang, whenCode: code, selector, shouldBe: localized }
      ] = args
      if (!only && isOnly) {
        return
      }

      it(`render: ${scenario}`, async () => {
        zero.appendScriptMdLocalizedCodalized('en', 'ts',`${given}`)

        if (lang) {
          zero.setLangByConfig(lang)
        }
        if (code) {
          zero.setCodeByConfig(code)
        }

        await zero.render()

        // console.log(`=========\n${scenario}\n\nfrom\n---------\n`, given)
        // console.log('---------\nto:\n---------\n', zeroBody$(selector).innerHTML)
        expect(zero.body$(selector).innerHTML).to.equal(localized)
        expect(zero.body$$(selector).length).to.equal(1)
      })

      it(`render: ${scenario} (NEW STYLE TAGS)`, async () => {
        zero.appendScriptMdLocalizedCodalized('en', 'py',`${given}`)
        if (lang) {
          zero.setLangByConfig(lang)
        }
        if (code) {
          zero.setCodeByConfig(code)
        }

        await zero.render()

        // console.log(`=========\n${scenario}\n\nfrom\n---------\n`, given)
        // console.log('---------\nto:\n---------\n', zeroBody$(selector).innerHTML)
        expect(zero.body$(selector).innerHTML).to.equal(localized)
        expect(zero.body$$(selector).length).to.equal(1)
      })
    })
  })
}
