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
  
  const zero$ = (selector) => zero.shadowRoot.querySelector(selector)
  const zeroBody = () => zero$('.markdown-body')
  const zeroBody$ = (selector) => zeroBody().querySelector(selector)

  const zeroAppendScriptMD = (text) => {
    const script = document.createElement('script')
    script.setAttribute('type', 'text/markdown')
    script.text = text
    zero.appendChild(script)
  }

  describe('Codalization', () => {
    it('renders code by main attribute in codalized option', async () => {
      zeroAppendScriptMD(`
<codalized main="java"/>

<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>`)
      await zero.render()
   
      expect(zeroBody$('.inline-content.active').innerText).to.equal('JAVA')
    })

    it('renders by zero-md config', async () => {
      zeroAppendScriptMD(`
<codalized main="java"/>

<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>`)

      zero.config.code = 'py'
      await zero.render()
  
      expect(zeroBody$('.inline-content.active').innerText).to.equal('PY')
    })

    it('renders by attributes', async () => {
      zeroAppendScriptMD(`
<codalized main="java"/>

<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>`)

      zero.setAttribute('code', 'cs')
      await zero.render()
   
      expect(zeroBody$('.inline-content.active').innerText).to.equal('CS')
    })

    it('should be overrided from attributes after zeroMdConfig', async () => {
      zeroAppendScriptMD(`
<codalized main="java"/>

<js>JS</js><ts>TS</ts><java>JAVA</java><py>PY</py><cs>CS</cs>`)
      zero.config.code = 'py'

      zero.setAttribute('code', 'cs')
      await zero.render()
   
      expect(zeroBody$('.inline-content.active').innerText).to.equal('CS')
    })

    it('auto re-renders on change of code attribute of zero-md', async () => {
      zero.remove()
      zero = common.addHtml('<zero-md code="py"></zero-md>')
      zeroAppendScriptMD(`
<codalized main="js"/>

<py>Pytest</py><js>Jest</js><java>Java</java>`)
      await zero.render()

      zero.code = 'java'
      await zero.waitForRendered()

      expect(zeroBody$('.inline-content.active').innerHTML).to.equal('Java')
    })
  })
}
