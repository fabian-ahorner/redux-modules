import {createActionCreator, createAssignmentCreator, createActionReducer, createMapDispatchToProps} from "../src";
import chai from 'chai'

describe('redux-super-actions', function () {
  describe('createAction', function () {
    it('crates action without arguments', () => {
      const action = createActionCreator('ACTION')
      chai.expect(action.type).to.equal('ACTION')
      chai.expect(action()).to.deep.equal({
        type: 'ACTION'
      })
    })

    it('crates action with single argument', () => {
      const action = createActionCreator('ACTION', 'arg1')
      chai.expect(action.type).to.equal('ACTION')
      chai.expect(action('value1')).to.deep.equal({
        type: 'ACTION',
        arg1: 'value1'
      })
    })

    it('does not add additional arguments to single argument action', () => {
      const action = createActionCreator('ACTION', 'arg1')
      chai.expect(action.type).to.equal('ACTION')
      chai.expect(action('value1', 'value2')).to.deep.equal({
        type: 'ACTION',
        arg1: 'value1'
      })
    })

    it('crates action with multiple arguments', () => {
      const action = createActionCreator('ACTION', ['arg1', 'arg2'])
      chai.expect(action.type).to.equal('ACTION')
      chai.expect(action('value1', 'value2')).to.deep.equal({
        type: 'ACTION',
        arg1: 'value1',
        arg2: 'value2'
      })
    })

    it('does not add additional arguments to multi argument action', () => {
      const action = createActionCreator('ACTION', ['arg1', 'arg2'])
      chai.expect(action.type).to.equal('ACTION')
      chai.expect(action('value1', 'value2', 'value3')).to.deep.equal({
        type: 'ACTION',
        arg1: 'value1',
        arg2: 'value2'
      })
    })

    it('crates action with custom function', () => {
      const action = createActionCreator('ACTION', (a, b = 3) => ({sum: a + b}))
      chai.expect(action.type).to.equal('ACTION')
      chai.expect(action(2, 6)).to.deep.equal({
        type: 'ACTION',
        sum: 8,
      })
    })
  })

  describe('createReducer', function () {
    const add = createActionCreator('ADD', 'x', ($$state, {x}) => ({...$$state, value: $$state.value + x}))
    const subtract = createActionCreator('SUBTRACT', 'x', ($$state, {x}) => ({...$$state, value: $$state.value - x}))

    it('combines action array to reducer', () => {
      const reducer = createActionReducer([add, subtract])
      let state = {old: 'data', value: 0}
      state = reducer(state, add(10))
      chai.expect(state).to.deep.equal({
        old: 'data',
        value: 10
      })
      state = reducer(state, subtract(2))
      chai.expect(state).to.deep.equal({
        old: 'data',
        value: 8
      })
    })

    it('combines action map to reducer', () => {
      const reducer = createActionReducer({add, subtract})
      let state = {old: 'data', value: 0}
      state = reducer(state, add(10))
      chai.expect(state).to.deep.equal({
        old: 'data',
        value: 10
      })
      state = reducer(state, subtract(2))
      chai.expect(state).to.deep.equal({
        old: 'data',
        value: 8
      })
    })

    it('uses the initial state', () => {
      const reducer = createActionReducer([add, subtract], {value: 100})
      let state = reducer(undefined, add(10))
      chai.expect(state).to.deep.equal({
        value: 110
      })
    })
  })

  describe('createAssignmentAction', function () {
    const assign = createAssignmentCreator('ASSIGN', ['a', 'b'])
    const customAssign = createAssignmentCreator('ASSIGN', (a, b = 3) => ({sum: a + b}))
    const reducer = createActionReducer([assign, customAssign])

    it('sets the values in the state', () => {
      let state = reducer({}, assign(1, 2))
      chai.expect(state).to.deep.equal({
        a: 1,
        b: 2
      })
    })

    it('uses generated action properties', () => {
      let state = reducer({}, customAssign(2))
      chai.expect(state).to.deep.equal({
        sum: 5
      })
    })
  })

  describe('createMapDispatchToProps', function () {
    const action1 = createActionCreator('ACTION1', ['a', 'b'])
    const action2 = createActionCreator('ACTION2', ['x'])

    it('sets the values in the state', () => {
      const mapDispatchToProps = createMapDispatchToProps({
        action1Alias: action1,
        action2Alias: action2
      })
      const dispatchedActions = []
      const dispatch = action => dispatchedActions.push(action)
      const props = mapDispatchToProps(dispatch)
      props.action1Alias(1, 2)
      props.action2Alias(3)

      chai.expect(dispatchedActions).to.deep.equal([
        {type: 'ACTION1', a: 1, b: 2},
        {type: 'ACTION2', x: 3}
      ])
    })
  })
})
