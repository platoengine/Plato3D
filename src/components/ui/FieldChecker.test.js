import {checkForUnmetConditionalView} from './FieldChecker'

//******************************************************************************/
//
// test checkForUnmetConditionalView()
//
test('checkForUnmetConditionalView()', () => {
  let tContext = {
    key1: { type: 'string', value: 'Val1'},
    key2: { type: 'string', value: 'Val2'},
    property1: {
      type: 'string',
      value: 'strVal',
      conditionalView: [['key1', 'Val1'],['key2', 'Val2']]
    }
  }
  let tKey = 'property1'
  expect(checkForUnmetConditionalView(tContext, tKey)).toBe(false);

  tContext = {
    key1: { type: 'string', value: 'Val1'},
    key2: { type: 'string', value: 'NotVal2'},
    property1: {
      type: 'string',
      value: 'strVal',
      conditionalView: [['key1', 'Val1'],['key2', 'Val2']]
    }
  }
  tKey = 'property1'
  expect(checkForUnmetConditionalView(tContext, tKey)).toBe(true);

  tContext = {
    key1: { type: 'string', value: 'Val1'},
    key2: { type: 'string', value: 'Val3'},
    property1: {
      type: 'string',
      value: 'strVal',
      conditionalView: [['key1', 'Val1'],['key2', ['Val2','Val3']]]
    }
  }
  tKey = 'property1'
  expect(checkForUnmetConditionalView(tContext, tKey)).toBe(false);
});
