/* eslint-env mocha */
/* global chai */

import common from './../utils/common.js'

export default function () {
  mocha.setup({
    ui: 'bdd'
  })

  describe('Custom tab name', () => {
    const assert = chai.assert
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
  
    it('should render correct number of tabs BUTTONS', async () => {
      zero.src = './unit-tests/tabs-template.md'

      await zero.render()

      expect(zeroBody$('.buttonWrapper').children.length).to.equal(5)
    })

    it('should render correct number of tabs CONTENT', async () => {
      zero.src = './unit-tests/tabs-template.md'

      await zero.render()

      expect(zeroBody$('.contentWrapper').children.length).to.equal(5)
    })

    it.skip('renders ACTIVE tab by main attribute in codalized option', async () => {
      zero.src = './unit-tests/tabs-template.md'

      await zero.render()

      assert.equal(zeroBody$('.tab-button.active').getAttribute('data-id'), zeroBody$('codalized').getAttribute('main'))
    })

    it('renders ACTIVE tab by CODE', async () => {
      zero.src = './unit-tests/tabs-template.md'
      zero.code = 'ts'

      await zero.render()

      expect(zeroBody$('.tab-button.active').getAttribute('data-id')).to.equal(zero.code)
    })

    it('', async () => {
      zero.src = './unit-tests/tabs-template.md'
      zero.code = 'ts'
      
      await zero.render()

      expect(zeroBody$('.tab-button.active').getAttribute('data-id')).to.equal(zero.code)
    })
  })
}