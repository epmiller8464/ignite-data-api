'use strict'

let Mock = require('./Mock')
let ComponentTypes =  require('./component').ComponentTypes

class BotBuilder {
  constructor () {
    let self = this
    self._bot = Mock.bot()
    self._blocks = []
    self._groups = []
    self._default_group = null
    self._start_block = null
    self._greeting_block = null
    self._persistent_menu_block = null
    self._default_block = null

  }

  setStartBlock () {
    this._start_block = Mock.block()
  }
}