//******************************************************************************/
// Tested: true
//
// Description: determine if aContext[aKey] is conditional AND those conditions 
// are unsatisfied.
//
// returns false if aContext[aKey] is not conditional or if it is conditional
// and the conditions are met.
// returns true if aContext[aKey] is conditional and the conditions are not met.
// 
//******************************************************************************/
export function checkForUnmetConditionalView(aContext, aKey){
  if('conditionalView' in aContext[aKey]){
    const conditions = aContext[aKey]['conditionalView']
    let conditionsMet = true
    conditions.forEach( condition => {
      const tKey = condition[0]
      const tVal = condition[1]
      if(Array.isArray(tVal)) {
        conditionsMet = conditionsMet && (tVal.includes(aContext[tKey].value))
      } else {
        conditionsMet = conditionsMet && (aContext[tKey].value === tVal)
      }
    })
    return !conditionsMet
  } else {
    return false
  }
}
  
//
// this function ignores the 'alias' attribute
//
export function allFieldsSpecified(prefix, key, flag){
  if (key === 'alias') {
    return flag
  }
  if(prefix[key] instanceof Object && !('value' in prefix[key])){
    if(checkForUnmetConditionalView(prefix, key) === false){
      const keys = Object.keys(prefix[key])
      if( !(key === 'conditionalView' || key === 'conditionalValue')){
        keys.forEach(key_=> {   
          flag = flag && allFieldsSpecified(prefix[key], key_, flag)
        })
      }
    }
  } else if ('value' in prefix[key]){
    if(checkForUnmetConditionalView(prefix, key) === false){
      if(!prefix[key].value || prefix[key].value ===""){
        flag = false
      }
    }
  }
  return flag  
}
       
export function listViewValidation(viewData){
  const mainKey = Object.keys(viewData)[0]
  let flag = true
  flag = allFieldsSpecified(viewData, mainKey, flag)
  return flag
}

export function singleViewValidation(viewData){
  const mainKeys = Object.keys(viewData)
  let flag = true
  mainKeys.forEach(key => {
    flag = allFieldsSpecified(viewData,key, flag)
  });
  return flag;
}
    



    

  


