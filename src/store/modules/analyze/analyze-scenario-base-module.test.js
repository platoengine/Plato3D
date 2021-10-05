import AnalyzeScenarioBase from './analyze-scenario-base-module'

let tMyInstance = new AnalyzeScenarioBase()

//******************************************************************************/
//
// test isConditional()
//
test('isConditional() === true', () => {
  let tMyObj = {
    conditionalView: [['Key1', 'Val1'],['Key2', 'Val2']]
  }
  expect(tMyInstance.isConditional(tMyObj)).toBe(true);
});

test('isConditional() === false', () => {
  let tMyObj = {
  }
  expect(tMyInstance.isConditional(tMyObj)).toBe(false);
});

//******************************************************************************/
//
// test hasPropertyOfType()
//
test('hasPropertyOfType() === true', () => {
  let tMyObj = {
    conditionalView: [['Key1', 'Val1'],['Key2', 'Val2']]
  }
  expect(tMyInstance.hasPropertyOfType(tMyObj, 'conditionalView', 'object')).toBe(true);
});

test('hasPropertyOfType() === false', () => {
  let tMyObj = {
  }
  expect(tMyInstance.hasPropertyOfType(tMyObj, 'conditionalView', 'object')).toBe(false);
});

//******************************************************************************/
//
// test conditionMet()
//
test('conditionMet()', () => {
  let tVar = { 'conditionalView': [['Type', ['Good', 'Bad']]] }

  let tContext = { 'Type': { type: 'string', value: 'Good' } }
  expect(tMyInstance.conditionMet(tVar, tContext)).toBe(true)

  tContext = { 'Type': { type: 'string', value: 'Bad' } }
  expect(tMyInstance.conditionMet(tVar, tContext)).toBe(true)

  tContext = { 'Type': { type: 'string', value: 'Ugly' } }
  expect(tMyInstance.conditionMet(tVar, tContext)).toBe(false)
});

//******************************************************************************/
//
// test getAlias()
//
test('getAlias()', () => {
  let tVar = { alias: 'myAlias' }
  expect(tMyInstance.getAlias(tVar, 'defaultAlias')).toBe('myAlias')

  tVar = {}
  expect(tMyInstance.getAlias(tVar, 'defaultAlias')).toBe('defaultAlias')
});
