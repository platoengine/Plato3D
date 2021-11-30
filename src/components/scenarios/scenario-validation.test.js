import {loadCheck, isLoadZero, checkForUnmetConditionalView} from './scenario-validation'

//******************************************************************************/
//
// test loadCheck()
//
test('loadCheck()', () => {
  let tContext = { Value: {type: 'double', value: '0.0'} }
  let tKey = 'Value'
  expect(loadCheck(tContext, tKey, 'Load Name').length).toBe(1);

  tContext = { Value: {type: 'double', value: '100.0'} }
  expect(loadCheck(tContext, tKey, 'Load Name').length).toBe(0);

  tContext = { Values: {type: 'double', value: {'X': '0.0', 'Y': '0.0', 'Z': '0.0'} } }
  tKey = 'Values'
  expect(loadCheck(tContext, tKey, 'Load Name').length).toBe(1);

  tContext = { Values: {type: 'double', value: {'X': '100.0', 'Y': '0.0', 'Z': '0.0'} } }
  tKey = 'Values'
  expect(loadCheck(tContext, tKey, 'Load Name').length).toBe(0);
});

//******************************************************************************/
//
// test isLoadZero()
//
test('isLoadZero()', () => {
  // tContext.Values.value.X = 100.0 and tContext.Type.value = 'Uniform' (expect no error)
  let tContext = {
    'Type': { type: 'string', value: 'Uniform', options: ['Uniform', 'Uniform Component', 'Uniform Pressure'] },
    'Values': { type: 'double', value: {'X': '100.0', 'Y': '0.0', 'Z': '0.0'}, conditionalView: [['Type', 'Uniform']] },
    'Value': { type: 'double', value: '0.0', conditionalView: [['Type', ['Uniform Component', 'Uniform Pressure']]] }
  }
  expect(isLoadZero(tContext, 'Load Name').length).toBe(0);

  // tContext.Value.value = 100.0 and tContext.Type.value = 'Uniform Component' (expect no error)
  tContext = {
    'Type': { type: 'string', value: 'Uniform Component', options: ['Uniform', 'Uniform Component', 'Uniform Pressure'] },
    'Values': { type: 'double', value: {'X': '0.0', 'Y': '0.0', 'Z': '0.0'}, conditionalView: [['Type', 'Uniform']] },
    'Value': { type: 'double', value: '100.0', conditionalView: [['Type', ['Uniform Component', 'Uniform Pressure']]] }
  }
  expect(isLoadZero(tContext, 'Load Name').length).toBe(0);

  // tContext.Value.value = 100.0 and tContext.Type.value = 'Uniform Pressure' (expect no error)
  tContext = {
    'Type': { type: 'string', value: 'Uniform Pressure', options: ['Uniform', 'Uniform Component', 'Uniform Pressure'] },
    'Values': { type: 'double', value: {'X': '0.0', 'Y': '0.0', 'Z': '0.0'}, conditionalView: [['Type', 'Uniform']] },
    'Value': { type: 'double', value: '100.0', conditionalView: [['Type', ['Uniform Component', 'Uniform Pressure']]] }
  }
  expect(isLoadZero(tContext, 'Load Name').length).toBe(0);

  // tContext.Value.value = 0.0 and tContext.Type.value = 'Uniform Pressure' (expect 1 error)
  tContext = {
    'Type': { type: 'string', value: 'Uniform Pressure', options: ['Uniform', 'Uniform Component', 'Uniform Pressure'] },
    'Values': { type: 'double', value: {'X': '100.0', 'Y': '0.0', 'Z': '0.0'}, conditionalView: [['Type', 'Uniform']] },
    'Value': { type: 'double', value: '0.0', conditionalView: [['Type', ['Uniform Component', 'Uniform Pressure']]] }
  }
  expect(isLoadZero(tContext, 'Load Name').length).toBe(1);

  // tContext.Value.value = 0.0 and tContext.Type.value = 'Uniform Component' (expect 1 error)
  tContext = {
    'Type': { type: 'string', value: 'Uniform Component', options: ['Uniform', 'Uniform Component', 'Uniform Pressure'] },
    'Values': { type: 'double', value: {'X': '0.0', 'Y': '0.0', 'Z': '0.0'}, conditionalView: [['Type', 'Uniform']] },
    'Value': { type: 'double', value: '0.0', conditionalView: [['Type', ['Uniform Component', 'Uniform Pressure']]] }
  }
  expect(isLoadZero(tContext, 'Load Name').length).toBe(1);
});

//******************************************************************************/
//
// test checkForUnmetConditionalView()
//
test('checkForUnmetConditionalView()', () => {
  // tContext.Values conditionalView is satisfied, so should return false
  let tContext = {
    'Type': { type: 'string', value: 'Uniform', options: ['Uniform', 'Uniform Component', 'Uniform Pressure'] },
    'Values': { type: 'double', value: {'X': '0.0', 'Y': '0.0', 'Z': '0.0'}, conditionalView: [['Type', 'Uniform']] },
    'Value': { type: 'double', value: '0.0', conditionalView: [['Type', ['Uniform Component', 'Uniform Pressure']]] },
    'Component': { type: 'string', value: 'X', options: ['X', 'Y', 'Z'], conditionalView: [['Type', 'Uniform Component']] },
    'Sides': { type: 'string', value: '', options: () => { return this.selectables['sidesets'] } }
  }
  let tLocalObject = tContext['Values']
  let tParentObject = tContext
  expect(checkForUnmetConditionalView(tLocalObject, tParentObject)).toBe(false);

  // tContext.Value conditionalView is unsatisfied, so should return true
  tLocalObject = tContext['Value']
  expect(checkForUnmetConditionalView(tLocalObject, tParentObject)).toBe(true);

  // tContext.Type is not conditional, so should return false
  tLocalObject = tContext['Type']
  expect(checkForUnmetConditionalView(tLocalObject, tParentObject)).toBe(false);
});

