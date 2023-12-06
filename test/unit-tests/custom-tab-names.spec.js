/* eslint-env mocha */
/* global chai */

import { Zero } from '../utils/Zero.js'

export default function () {
  mocha.setup({
    ui: 'bdd'
  })

  const assert = chai.assert
  const expect = chai.expect

  const zero = new Zero()

  describe('Custom tab name', () => {
    beforeEach(() => {
      zero.addHtml(`<zero-md manual-render></zero-md>`)
    })
    afterEach(() => {
      zero.remove()
    })
  
    it('should render correct number of tabs BUTTONS', async () => {
      zero.src('./unit-tests/tabs-template.md')

      await zero.render()

      expect(zero.body$('.buttonWrapper').children.length).to.equal(5)
    })

    it('should render correct number of tabs CONTENT', async () => {
      zero.src('./unit-tests/tabs-template.md')

      await zero.render()

      expect(zero.body$('.contentWrapper').children.length).to.equal(5)
    })

    it.skip('renders ACTIVE tab by main attribute in codalized option', async () => {
      zero.src('./unit-tests/tabs-template.md')

      await zero.render()

      assert.equal(zero.body$('.tab-button.active').getAttribute('data-id'), zero.body$('codalized').getAttribute('main'))
    })

    it('renders ACTIVE tab by CODE', async () => {
      zero.src('./unit-tests/tabs-template.md')
      zero.setCodeByAttribute('ts')

      await zero.render()

      expect(zero.body$('.tab-button.active').getAttribute('data-id')).to.equal('ts')
    })

    it('', async () => {
      zero.src('./unit-tests/tabs-template.md')
      zero.setCodeByAttribute('ts')
      
      await zero.render()

      expect(zero.body$('.tab-button.active').getAttribute('data-id')).to.equal('ts')
    })
  })
}