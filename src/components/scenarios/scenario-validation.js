"use strict"; 

function getKeys(prefixObject){
  return Object.keys(prefixObject)
}

function getUserGeneratedFieldNames(prefix){
  let functionNames = []
  prefix.forEach(function(prefix_item){
    functionNames.push(getKeys(prefix_item))
  });
  return functionNames   
}

function poissonsRatioCheck(prefix, key){
  if(prefix){
    if(key === 'Poissons Ratio'){
      if(!(prefix[key].value >= 0.0 && prefix[key].value <=0.5)){
        return ['Poissons Ratio must be in range 0.0 - 0.5']
      } else if(!prefix[key].value) {
        return ['Must specify Poissons Ratio']
      }
    }
  }
  return []
}

//******************************************************************************/
// Tested: true
//
// Description: determine if a load is specified that has zero value(s)
//
// returns a list of errors
// 
//******************************************************************************/
export function loadCheck(prefix, view, fieldSpecifier){
  if(view === "Value"){
    if(prefix['Value'].value == 0){
      return ['Load value in '+fieldSpecifier+' must not be 0']
    }
  } else if (view === "Values"){
    let errors = []
    let vectorIsZero = true
    for (const key in prefix['Values'].value) {
      vectorIsZero = vectorIsZero && (prefix['Values']['value'][key] == 0)
    }
    if(vectorIsZero) {
      errors.push('All fields in '+fieldSpecifier+' must not be 0')
    }
    return errors
  }
  return []
}
    
//******************************************************************************/
// Tested: true
//
// Description: determine if a load is specified that has zero value(s)
// considering the 'conditionalView' fields.
//
// returns a list of errors
// 
//******************************************************************************/
export function isLoadZero(aLocalObject, aFieldSpecifier){   
  // check 'Value'
  if(!checkForUnmetConditionalView(aLocalObject["Value"], aLocalObject)){
    return loadCheck(aLocalObject, "Value", aFieldSpecifier)
  } else
  // check 'Values'
  if(!checkForUnmetConditionalView(aLocalObject["Values"], aLocalObject)){
    return loadCheck(aLocalObject, "Values", aFieldSpecifier)
  }
  return []
}

//******************************************************************************/
// Tested: true
//
// Description: determine if aLocalObject has an unmet conditional view based on
// data in aParentObject.
//
// returns true if aLocalObject is conditional and those conditions aren't met.
// returns false if aLocalObject is conditional and those conditions are met.
// returns false if aLocalObject is not conditional
// 
//******************************************************************************/
export function checkForUnmetConditionalView(aLocalObject, aParentObject){
  if('conditionalView' in aLocalObject){
    const conditions = aLocalObject['conditionalView']
    let conditionsMet = true
    conditions.forEach( condition => {
      const tKey = condition[0]
      const tVal = condition[1]
      if(Array.isArray(tVal)) {
        conditionsMet = conditionsMet && (tVal.includes(aParentObject[tKey].value))
      } else {
        conditionsMet = conditionsMet && (aParentObject[tKey].value === tVal)
      }
    })
    return !conditionsMet
  } else {
    return false
  }
}    

function automateValidation(aTemplateObject, aKey, aDataObject, aFieldSpecifier, aParentObject) {   
  if(typeof aTemplateObject[aKey] !== 'object') {
    return []
  }
  if(!('value' in aTemplateObject[aKey]) && aTemplateObject[aKey] instanceof Object){
    if(checkForUnmetConditionalView(aTemplateObject, aParentObject)){return []}
    const keysIn = getKeys(aTemplateObject[aKey]) 
    if(aKey === 'conditionalView' || aKey === 'conditionalValue') {return []}
    return keysIn.flatMap(
      keyIn => automateValidation(aTemplateObject[aKey], keyIn, aDataObject[aKey], aFieldSpecifier, aDataObject)
    )
  } else  if('value' in aTemplateObject[aKey] ){  
    if(checkForUnmetConditionalView(aTemplateObject, aParentObject)){return []}
    if(aKey === 'Poissons Ratio'){
      return poissonsRatioCheck(aDataObject, aKey)
    }
    if(!aDataObject[aKey].value || aDataObject[aKey].value === ""){
      return['Must specify '+aKey+' in '+ aFieldSpecifier ]
    } 
  }
  return []
}
function validateModel(prefix){
  if(!prefix.geometry.body.fileName){
    return [' Must specify Model']
  } else {
    return []
  }
}
  
export function validateScenario(scenario){
  const infoIn = scenario.modelviews
  const mainKeys = Object.keys(infoIn)
  let errors = []
  errors = errors.concat(validateModel(scenario))
  mainKeys.forEach(key => {
    const tViewObject = infoIn[key].view
    const tDataObject = infoIn[key].data
    const tIsRequired = infoIn[key].required
    const tViewObjectTemplate = tViewObject['<Template>']
    if(!tDataObject || (JSON.stringify(tDataObject) === JSON.stringify({})) ||
      (getKeys(tDataObject).length === 0 && tDataObject.constructor === Object)||
      (tDataObject.length == 0 && Array.isArray(tDataObject) && tIsRequired===true)){
        errors.push('Must specify '+key)
    } else {
      if(tViewObject.type === 'single-view'){      
        const subKeys = getKeys(tViewObjectTemplate)
        subKeys.forEach(subKey => {
          errors = errors.concat(automateValidation(tViewObjectTemplate, subKey, tDataObject, key, {}))
        })  
      } else if(tViewObject.type === 'list-view'){
        let subKeys = getKeys(tViewObjectTemplate)
        subKeys.forEach(subKey => {
          const userGeneratedFieldNames = getUserGeneratedFieldNames(tDataObject)
          
          if(userGeneratedFieldNames.length > 0){
            for(var index in userGeneratedFieldNames){ 
              const userGeneratedFieldName = userGeneratedFieldNames[index]
              errors = errors.concat(
                automateValidation(tViewObjectTemplate
                , subKey, tDataObject[index][userGeneratedFieldName]
                , userGeneratedFieldName, {})
              )
              
              if(key.includes('Loads') && subKey === 'Value'){
                errors = errors.concat(isLoadZero(tDataObject[index][userGeneratedFieldName], userGeneratedFieldName))
              }
            }
          }
        })
      } else if (tViewObject.type === 'option-view'){
        const optionSet = getKeys(tDataObject)[0]
        const optionInfo = tViewObject['<Options>'][optionSet]
        let subKeys = getKeys(optionInfo)
        /*errors = subKeys.flatMap(subKey => 
          automateValidation(tViewObject['<Options>'][optionSet], subKey, tDataObject[optionSet], infoIn[key], key)
        ) */
        subKeys.forEach(subKey =>
          errors = errors.concat(automateValidation(optionInfo, subKey, tDataObject[optionSet], key, {}))
        )       
      }
    } 
  })
  return errors
}
