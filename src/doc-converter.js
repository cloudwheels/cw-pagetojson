/* eslint-disable require-jsdoc */
/* eslint-disable valid-jsdoc */
'use strict';
// import {fetch} from 'cross-fetch';
const fetch = require('cross-fetch');
const cTables = require('./htmltable-to-json');

class ConvertedDoc {
  constructor(
      result

  ) {
    this.result = result;
  }
  /**
   * Static method returning a new instance of ConvertedDoc
   * @param  {Promise<any>} doc a promise for the content to be converted
   * @param  {Promise<tuple<any>>} docconverters a promise
   *  for a tuple of doc converters
   * to be excecuted against the doc in order
   * @retuns {Promise<ConvertedDoc>} a promise for a new Converted doc
   */
  static async convert(promiseForDoc, docconverter) {
    // console.log('waiting for a doc to convert');
    const _doc = await promiseForDoc;
    // console.log('great, I got this:');
    // console.log(_doc);
    return new Promise((resolve, reject)=>{
      // catch

      if (_doc && docconverter) {
        const _docconverter = new docconverter()
        _docconverter.docToConvert = _doc;
        _docconverter.convertedDoc
            .then((result) => {
              // const _convertedDoc = new ConvertedDoc(result);
              // _convertedDoc.doc = result;
              // console.log('success', _convertedDoc.doc);
              resolve(new ConvertedDoc(result));
            })
            .catch((error) => {
              // console.log('error', error);
              reject(error);
            });
      }
    });
  }
}

// console.log(convertedDoc.doc);
// eslint-disable-next-line max-len


function validHTTPResponse(reqURL, format) {
  return new Promise((resolve, reject)=> {
    fetch.fetch(reqURL)
        .then((response)=>{
          if (response.status >= 200 && response.status < 300) {
            switch (format) {
              default:
                response.text().then((result)=> {
                  resolve(result);
                });
            }
          } else {
            reject(new Error(response.statusText));
          }
        })
        .catch((error)=>{
          reject(new Error(error));
        });
  });
}
/*
validHTTPResponse('https://en.wikipedia.org/wiki/List_of_country_calling_codes', 'text')
    .then((response)=> {
      console.log(response);
      // return;
    })
    .catch((error)=> {
      console.log(error);
      //return
    });
*/



ConvertedDoc.convert(
    // Promise.resolve('mydoc'), // a  promise for a document
    validHTTPResponse('https://en.wikipedia.org/wiki/List_of_country_calling_codes', 'text'),
    // promise for the reponse body of url as text
    /*
    {convert:
      ()=>{
        return Promise.resolve('converted doc');
      },
    }
    */
    cTables.HTMLTableToJsonConverter
)
    .then((result)=> {
      console.log(JSON.stringify(result));
      // Promise.resolve(result);
    })
    .catch(((error)=>console.log(error)));



    /*
    const teststring = '<html><table><thead><tr></tr><th>Header</th></tr></thead><tbody><tr><td>woohoo</td></tr></tbody></table><table><thead><tr></tr><th>T2 Header</th></tr></thead><tbody><tr><td>wahay</td></tr></tbody></table></html>'
const converter = new HTMLTableToJsonConverter();
console.log('options:', JSON.stringify(converter.options));
converter.docToConvert = teststring;
console.log('doc to convert:', converter.docToConvert );
console.log(converter.convertedDoc);
*/
