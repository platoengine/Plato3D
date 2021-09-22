function checkForConditionalView(aContext, aKey){
  if('conditionalView' in aContext[aKey]){
    const condition = aContext[aKey]['conditionalView']
    const tKey = condition[0]
    const tVal = condition[1]
    if(Array.isArray(tVal)) {
      return !(tVal.includes(aContext[tKey].value))
    } else {
      return aContext[tKey].value != tVal
    }   
  }
  return false
}
  
//
// this function ignores the 'alias' attribute
//
export function allFieldsSpecified(prefix, key, flag){
  if (key === 'alias') {
    return flag
  }
  if(prefix[key] instanceof Object && !('value' in prefix[key])){
    if(checkForConditionalView(prefix, key) === false){
      const keys = Object.keys(prefix[key])
      if( !(key === 'conditionalView' || key === 'conditionalValue')){
        keys.forEach(key_=> {   
          flag = flag && allFieldsSpecified(prefix[key], key_, flag)
        })
      }
    }
  } else if ('value' in prefix[key]){
    if(checkForConditionalView(prefix, key) === false){
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
    



    

  


