function checkForConditionalView(prefix, key){
  if('conditionalView' in prefix[key]){
    const setView = prefix[key]['conditionalView']
    if(prefix[setView[0]].value != setView[1]){
      return true;
    }   
  }
  return false
}
  
function allFieldsSpecified(prefix, key, flag){
  if(!('value' in prefix[key])&& prefix[key] instanceof Object){
    if(checkForConditionalView(prefix, key) === false){
      const keys = Object.keys(prefix[key])
      if( !(key === 'conditionalView')){
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
    



    

  


