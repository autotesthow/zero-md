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

  describe('Not-code', () => {
    beforeEach(() => {
      zero.addHtml(`<zero-md manual-render></zero-md>`)
    })
    afterEach(() => {
      zero.remove()
    })
   
    it('renders code by main attribute in codalized option <not-js>', async () => {
      zero.appendScriptMdCodalized('java', `
<not-js>NOT-JS</not-js>`)
      await zero.render()
   
      expect(zero.body$('.inline-content.active').innerText).to.equal('NOT-JS')
    })

    it('renders code by main attribute in codalized option <not-js-java>', async () => {
      zero.appendScriptMdCodalized('py', `
<not-js-java>NOT-JS-JAVA</not-js-java>`)
      await zero.render()
   
      expect(zero.body$('.inline-content.active').innerText).to.equal('NOT-JS-JAVA')
    })

    it('renders code by main attribute in codalized option <not-ts-py-cs>', async () => {
      zero.appendScriptMdCodalized('java', `
<not-ts-py-cs>NOT-TS-PY-CS</not-ts-py-cs>`)
      await zero.render()
   
      expect(zero.body$('.inline-content.active').innerText).to.equal('NOT-TS-PY-CS')
    })

    it('NO renders code by main attribute in codalized option <not-js>', async () => {
      zero.appendScriptMdCodalized('js', `
<not-js>NOT-JS</not-js>`)
      await zero.render()
   
      expect(zero.body$('.inline-content').checkVisibility()).to.be.false
    })

    it('NO renders code by main attribute in codalized option <not-js-java>', async () => {
      zero.appendScriptMdCodalized('java', `
<not-js-java>NOT-JS-JAVA</not-js-java>`)
      await zero.render()
   
      expect(zero.body$('.inline-content').checkVisibility()).to.be.false
    })

    it('NO renders code by main attribute in codalized option <not-ts-py-cs>', async () => {
      zero.appendScriptMdCodalized('py', `
<not-ts-py-cs>NOT-TS-PY-CS</not-ts-py-cs>`)
      await zero.render()
   
      expect(zero.body$('.inline-content').checkVisibility()).to.be.false
    })
  })
}