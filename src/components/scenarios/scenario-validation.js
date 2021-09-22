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
function loadCheck(prefix, view, fieldSpecifier){
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
    
function isLoadZero(prefix, fieldSpecifier){   
  const value = "Value"
  const values = "Values" 
  const prefixValue = prefix[value]
  const prefixValues = prefix[values] 
  if(!(prefixValue === undefined) && 'conditionalView' in prefixValue && prefixValue['conditionalView'][1] === prefix.Type.value) {
    return loadCheck(prefix, value, fieldSpecifier)
  } else if(!(prefixValues === undefined) && 'conditionalView' in prefixValues && prefixValues['conditionalView'][1] === prefix.Type.value){
    return loadCheck(prefix, values, fieldSpecifier)
  } else if(!(prefixValue === undefined)){
    return loadCheck(prefix, value, fieldSpecifier)
  } else if(!(prefixValues === undefined)) {
    return loadCheck(prefix, values, fieldSpecifier)
  }
  return []
}

function checkForConditionalView(prefix, parentObject){
  if('conditionalView' in prefix){
    const conditionalViewPrefix = prefix['conditionalView']
    const setDataView = parentObject[conditionalViewPrefix[0]].value
    const setView = conditionalViewPrefix[1]
    if(Array.isArray(setView)) {
      return !(setView.includes(setDataView))
    } else {
      return (setDataView != setView)
    }
  }
  return false
}    

function automateValidation(prefix, key, dataPrefix, fieldSpecifier, parentObject) {   
  if(typeof prefix[key] !== 'object') {
    return []
  }
  if(!('value' in prefix[key]) && prefix[key] instanceof Object){
    if(checkForConditionalView(prefix, parentObject)){return []}
    const keysIn = getKeys(prefix[key]) 
    if(key === 'conditionalView' || key === 'conditionalValue') {return []}
    return keysIn.flatMap(
      keyIn => automateValidation(prefix[key], keyIn, dataPrefix[key], fieldSpecifier, dataPrefix)
    )
  } else  if('value' in prefix[key] ){  
    if(checkForConditionalView(prefix, parentObject)){return []}
    if(key === 'Poissons Ratio'){
      return poissonsRatioCheck(dataPrefix, key)
    }
    if(!dataPrefix[key].value || dataPrefix[key].value === ""){
      return['Must specify '+key+' in '+ fieldSpecifier ]
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
    const viewPrefix = infoIn[key].view
    const dataPrefix = infoIn[key].data
    const reqPrefix = infoIn[key].required
    const viewPrefixTemplate = viewPrefix['<Template>']
    if(!dataPrefix || (JSON.stringify(dataPrefix) === JSON.stringify({})) ||
      (getKeys(dataPrefix).length === 0 && dataPrefix.constructor === Object)||
      (dataPrefix.length == 0 && Array.isArray(dataPrefix) && reqPrefix===true)){
        errors.push('Must specify '+key)
    } else {
      if(viewPrefix.type === 'single-view'){      
        const subKeys = getKeys(viewPrefixTemplate)
        subKeys.forEach(subKey => {
          errors = errors.concat(automateValidation(viewPrefixTemplate, subKey, dataPrefix, key, {}))
        })  
      } else if(viewPrefix.type === 'list-view'){
        let subKeys = getKeys(viewPrefixTemplate)
        subKeys.forEach(subKey => {
          const userGeneratedFieldNames = getUserGeneratedFieldNames(dataPrefix)
          
          if(userGeneratedFieldNames.length > 0){
            for(var index in userGeneratedFieldNames){ 
              const userGeneratedFieldName = userGeneratedFieldNames[index]
              errors = errors.concat(
                automateValidation(viewPrefixTemplate
                , subKey, dataPrefix[index][userGeneratedFieldName]
                , userGeneratedFieldName, {})
              )
              
              if(key.includes('Loads') && subKey === 'Value'){
                errors = errors.concat(isLoadZero(dataPrefix[index][userGeneratedFieldName], userGeneratedFieldName))
              }
            }
          }
        })
      } else if (viewPrefix.type === 'option-view'){
        const optionSet = getKeys(dataPrefix)[0]
        const optionInfo = viewPrefix['<Options>'][optionSet]
        let subKeys = getKeys(optionInfo)
        /*errors = subKeys.flatMap(subKey => 
          automateValidation(viewPrefix['<Options>'][optionSet], subKey, dataPrefix[optionSet], infoIn[key], key)
        ) */
        subKeys.forEach(subKey =>
          errors = errors.concat(automateValidation(optionInfo, subKey, dataPrefix[optionSet], key, {}))
        )       
      }
    } 
  })
  return errors
}
