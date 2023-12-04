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

  beforeEach(() => {
    zero.addHtml(`<zero-md manual-render></zero-md>`)
  })
  afterEach(() => {
    zero.remove()
  })
  
  describe('Codalization', () => {
    it('renders code by main attribute in codalized option', async () => {
      zero.appendScriptMD(`
<codalized main="java"/>

<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>`)
      await zero.render()
   
      expect(zero.body$('.inline-content.active').innerText).to.equal('JAVA')
    })

    it('renders by zero-md config', async () => {
      zero.appendScriptMD(`
<codalized main="java"/>

<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>`)

      zero.setCodeByConfig('py')
      await zero.render()
  
      expect(zero.body$('.inline-content.active').innerText).to.equal('PY')
    })

    it('renders by attributes', async () => {
      zero.appendScriptMD(`
<codalized main="java"/>

<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>`)

      zero.setCodeByAttribute('cs')
      await zero.render()
   
      expect(zero.body$('.inline-content.active').innerText).to.equal('CS')
    })

    it('should be overrided from attributes after zeroMdConfig', async () => {
      zero.appendScriptMD(`
<codalized main="java"/>

<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>`)
      zero.setCodeByConfig('py')

      zero.setCodeByAttribute('cs')
      await zero.render()
   
      expect(zero.body$('.inline-content.active').innerText).to.equal('CS')
    })

    it('auto re-renders on change of code attribute of zero-md', async () => {
      zero.remove()
      zero.addHtml('<zero-md code="py"></zero-md>')
      zero.appendScriptMD(`
<codalized main="js"/>

<py>Pytest</py><js>Jest</js><java>Java</java>`)
      await zero.render()

      zero.setCodeByAttribute('java')
      await zero.get().waitForRendered()

      expect(zero.body$('.inline-content.active').innerHTML).to.equal('Java')
    })
  })
}
