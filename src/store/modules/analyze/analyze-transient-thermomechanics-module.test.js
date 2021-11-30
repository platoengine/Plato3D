//var DOMParser = require('xmldom').DOMParser;
import {DOMParser} from 'xmldom'
import TeuchosParser from '../teuchos-parser-module'
import AnalyzeTransientThermomechanics from './analyze-transient-thermomechanics-module'

let teuchosParser = new TeuchosParser()
let tMyInstance = new AnalyzeTransientThermomechanics()

//
test('Parse time-independent Thermal Mass', () => {
//

  const parser = new DOMParser()

  let tKey = 'Specific Heat'
  let tListName = 'Thermal Mass'

  let tInput = 
  `<ParameterList name='Thermal Mass'>
     <Parameter name='Specific Heat' type='double' value='900.0'/>
     <Parameter name='Mass Density' type='double' value='2700.0'/>
   </ParameterList>`
  
  const doc = parser.parseFromString(tInput, 'text/xml')
  let tParams = teuchosParser.getParameterList(doc, tListName)
  let tParamsObject = teuchosParser.toObject(tParams)
  let tFromObject = tParamsObject[tListName]

  let tToObject = tMyInstance.modelviews['Material Models']['view']['<Template>'][tListName]

  let tResult = tMyInstance.getConditionalSub(tFromObject, tToObject, tKey)

  expect(tResult.value).toBe('900.0')
});

//
test('Parse time-dependent Thermal Conductivity', () => {
//

  const parser = new DOMParser()

  let tKey = 'Thermal Conductivity'
  let tListName = 'Thermoelastic'

  let tInput = 
  `<ParameterList name="Thermoelastic">
     <Parameter name="Temperature Dependent" type="bool" value="true"/>
     <Parameter name="Reference Temperature" type="double" value="0.0"/>
     <ParameterList name="Thermal Conductivity">
       <Parameter name="c011" type="double" value="205.0"/>
       <Parameter name="c111" type="double" value="-0.02"/>
       <Parameter name="c211" type="double" value="0.0008"/>
     </ParameterList>
     <ParameterList name="Thermal Expansivity">
       <Parameter name="c011" type="double" value="22.06e-6"/>
       <Parameter name="c111" type="double" value="3.9309e-8"/>
       <Parameter name="c211" type="double" value="-7.82412e-11"/>
     </ParameterList>
     <ParameterList name="Elastic Stiffness">
       <ParameterList name="Youngs Modulus">
         <Parameter name="c0" type="double" value="6.90342e10"/>
         <Parameter name="c1" type="double" value="-3.33342e7"/>
         <Parameter name="c2" type="double" value="-1.26564e4"/>
       </ParameterList>
       <Parameter name="Poissons Ratio" type="double" value="0.35"/>
     </ParameterList>
   </ParameterList>`
  
  const doc = parser.parseFromString(tInput, 'text/xml')
  let tParams = teuchosParser.getParameterList(doc, tListName)
  let tParamsObject = teuchosParser.toObject(tParams)
  let tFromObject = tParamsObject[tListName]

  let tToObject = tMyInstance.modelviews['Material Models']['view']['<Template>'][tListName]

  let tResult = tMyInstance.getConditionalSub(tFromObject, tToObject, tKey)

  expect(tResult.c011.value).toBe('205.0')
});
