'use strict'
const should = require('should')
const {describe, it, before} = require('mocha')
const {ButtonTypes, UrlButton, PostbackButton, Element, DefaultAction} = require('../lib/buttons')
const {ComponentTypes, GetStarted, Greeting, CallToAction, PersistentMenu, GenericTemplate, ListTemplate, ButtonTemplate, TextComponent, AudioComponent, VideoComponent, ImageComponent, FileComponent} = require('../lib/component')
const _ = require('lodash')
const faker = require('faker')
const chance = require('chance')
const {assert} = require('assert')
describe('Button Tests', () => {

  before(() => {

  })

  it('DefaultAction Validation Test', (done) => {
    let bad = new DefaultAction({
      title: 'Default Action',
      url: 'http://google.com',
      subtitle: ''
    }, 'btn 1', 'btn 2', 'btn 3', 'btn 4')

    let good = new DefaultAction({
      title: 'WebUrl',
      url: 'https://google.com',
      subtitle: ''
    }, 'btn 1', 'btn 2', 'btn 3')

    let badResult = bad.isValid()
    should.exist(badResult)
    should.exist(badResult.errors)
    should.equal(badResult.isValid, false)
    console.log(badResult.errors)
    let goodResults = good.isValid()
    should.exist(goodResults)
    should.not.exist(goodResults.errors)
    should.equal(goodResults.isValid, true)
    done()
  })

  it('UrlButton Validation Test', (done) => {
    let bad = new UrlButton({
      title: '',
      url: 'http://google.com'
    })

    let good = new UrlButton({
      title: 'Url',
      url: 'https://google.com'
    })

    let badResult = bad.isValid()
    should.exist(badResult)
    should.exist(badResult.errors)
    should.equal(badResult.isValid, false)
    console.log(badResult.errors)
    let goodResults = good.isValid()
    should.exist(goodResults)
    should.not.exist(goodResults.errors)
    should.equal(goodResults.isValid, true)
    done()
  })

  it('PostbackButton Validation Test', (done) => {
    let bad = new PostbackButton({
      title: '',
      url: 'http://google'
    })

    let good = new PostbackButton({
      title: 'Url'
    }, faker.random.uuid(), faker.random.uuid())

    let badResult = bad.isValid()
    should.exist(badResult)
    should.exist(badResult.errors)
    should.equal(badResult.isValid, false)
    console.log(badResult.errors)
    let goodResults = good.isValid()
    should.exist(goodResults)
    should.not.exist(goodResults.errors)
    should.equal(goodResults.isValid, true)
    console.log(good.toObject())
    done()
  })

  it('Element Validation Test', (done) => {

    let bad = new Element({
      title: '',
      image_url: faker.internet.url(),
      subtitle: faker.lorem.paragraph()
    }, 'btn 1', 'btn 2', 'btn 3', 'btn 4')

    let good = new Element({
      title: faker.lorem.word(),
      image_url: faker.image.business(),
      subtitle: faker.lorem.word()
    }, new PostbackButton({
      title: 'Url'
    }, faker.random.uuid(), faker.random.uuid()), new UrlButton({title: 'View Me', url: 'https://google.com'}))

    let badResult = bad.isValid()
    should.exist(badResult)
    should.exist(badResult.errors)
    should.equal(badResult.isValid, false)
    console.log(badResult.errors)
    let goodResults = good.isValid()
    should.exist(goodResults)
    should.not.exist(goodResults.errors)
    should.equal(goodResults.isValid, true)
    console.log(good.toObject())
    done()
  })
// it('UrlButton Validation Test', (done) => {
//   let bad = new UrlButton({title: 'WebUrl', url: 'https://google.com', subtitle: ''}, 1, 23, 3)
//   let good = new UrlButton({title: 'WebUrl', url: 'https://google.com', subtitle: ''}, 1, 23, 3)
//   done()
// })
//
// it('PostbackButton Validation Test', (done) => {
//   let bad = new PostbackButton({title: 'WebUrl', url: 'https://google.com', subtitle: ''}, 1, 23, 3)
//   let good = new PostbackButton({title: 'WebUrl', url: 'https://google.com', subtitle: ''}, 1, 23, 3)
//   done()
// })
})

describe('Compoenent Tests', () => {
  it('GenericTemplate Component Test', (done) => {

    let element = new Element({
      title: faker.lorem.word(),
      image_url: faker.image.business(),
      subtitle: faker.lorem.word()
    })
    element.addButton(new UrlButton({
      title: '',
      url: 'http://google.com'
    }))

    // let goodResults = element.isValid()

    let genericTemplate = new GenericTemplate({})

    genericTemplate.addElement(element)

    done()
  })

})