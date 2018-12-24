/* eslint-disable require-jsdoc */
// RxJS
const rxjs = require('rxjs/Observable');
const Observer = require('rxjs/Observer');
const rx = require('rxjs');
//con'rxjs/observable/concat
const defer = require('rxjs/add/observable/defer');

function reverseString(str) {
  return (str === '') ? '' : reverseString(str.substr(1)) + str.charAt(0);
}
// -------- vvv CHNAGE TO INHERIT
class ReverseElementProcessor {
  constructor() {
    const self=this;
    self._input = new rx.BehaviorSubject();
    // self._input.next('init');
    self._obsResult = rxjs.Observable;
    
  }
 
  set input(newInput) {
    if (newInput) {
      this._input.next(newInput); 
    }
  }

  get input() {
    return this._input;
  }

  get obsResult() {
    const self = this;
    self._obsResult =  rxjs.Observable.defer(function () {
      return rxjs.Observable.create(async function(oResult) {
        self._input.subscribe((observedInput)=>{
        // console.log ('console - rev  rec d  m', observedInput);
        const startMainMsg = 'REVERSE STATED started';
        oResult.next(startMainMsg);
        oResult.next('REV returning input');
        oResult.next(reverseString(observedInput)); // !!! REMOVE
        // eslint-disable-next-line max-len
        const completeElementProcessorMsg = 'REVE OMMPLTED...';
        oResult.next(completeElementProcessorMsg);
        oResult.complete();
        });  
      });
    });
    return self._obsResult;
  }
}

// ------------ CHNAGE TO INHERTEIT ^^^^^





class DefaultElementProcessor {
  constructor() {
    const self=this;
    self._input = new rx.BehaviorSubject();
    // self._input.next('init');
    self._obsResult = rxjs.Observable;
    
  }
 
  set input(newInput) {
    if (newInput) {
      this._input.next(newInput); 
    }
  }

  get input() {
    return this._input;
  }

  get obsResult() {
    const self = this;
    self._obsResult =  rxjs.Observable.defer(function () {
      return rxjs.Observable.create(async function(oResult) {
        self._input.subscribe((observedInput)=>{
        const startMainMsg = 'element processot result observable started';
        oResult.next(startMainMsg);
        oResult.next('returning input');
        oResult.next(observedInput);
        // eslint-disable-next-line max-len
        const completeElementProcessorMsg = 'element processor result observable completed - sending complete next...';
        oResult.next(completeElementProcessorMsg);
        oResult.complete();
        });  
      });
    });
    return self._obsResult;
  }
}


class ObservableDocProcessor {
  constructor() {
    const self=this;
    self._finalResult = new rx.Subject();
    self._info = new rx.ReplaySubject();
    self._input = new rx.ReplaySubject(1);
    // self._input.next('init');
    self._previousOutput = false;
    self._obsResult = rxjs.Observable;
    self._defaultElementProcessor = DefaultElementProcessor;
    self._arrElementProcessors = [self._defaultElementProcessor, ReverseElementProcessor];
    self._arrObsElementProcessorResults = [];
    self._results = {
      // eslint-disable-next-line max-len
      result: self._obsResult, elementResults: self._arrObsElementProcessorResults,
    };
  }

  get finalResult() {
    return this._finalResult;
  }
/*
  set info(newInfo) {
    if (newInfo) {
      this._info.next(newInfo);
      
    }
  }
*/
  get info() {
    return this._info;
  }

  set input(newInput) {
    if (newInput) {
      this._input.next(newInput);
      
    }
  }
/* no getter for input or you could steal the data from the subject ;)
  get input() {
    return this._input;
  }
  */

  get obsResult() {
    const self = this;
    self._obsResult =  rxjs.Observable.defer(function () {
      return rxjs.Observable.create(async function(oResultMain) {
        self._input.subscribe((observedInput)=>{
        // var EPObsResSub = null;
        // var arrEPObsResSubs = [];
        const startMainMsg ={
          error:false, 
          info: 'main result observable started',
          result:false,
          processorData:false
        };
        self._info.next(startMainMsg.info)
        oResultMain.next(startMainMsg);
        // oResultMain.next('invoking element processors');
        // find how to wait for these reults for the final reult and diferent stages
        // and pass this observable back to main function
        self._previousOutput = false;
        self._arrElementProcessors.forEach((elementProcessor)=>{
          let eP = new elementProcessor(); // (typeof elementProcessor)();
        // eP.input = self._previousOutput || observedInput;
        if(observedInput){eP.input = observedInput}else {eP.input.subscribe(self._previousOutput)}; 
          let thisOutput = eP.obsResult; //.subscribe((x) => console.log(x));
          //self._arrObsElementProcessorResults.push(thisOutput)
          thisOutput.subscribe((x) => {
            const msg ={
              error:false, 
              info: 'processor output',
              result:false,
              processorData:x,
            };
            self._info.next(msg.info)
            oResultMain.next(msg)
        
        });
          // add to an aray of out put observables
          self._previousOutput = thisOutput;
        }); //finish forEach
        self._arrObsElementProcessorResults.forEach((obsRes)=>{
         // console.log('obs result interal:', obsRes)
         
        // eslint-disable-next-line max-len
        })
        const completeMainMsg ={
          error:false, 
          info: 'main result observable completed',
          result:{
            success:true,
            data: 'THE FINAL RESULT'
            },
          processorData:false,
        };
        self._info.next(completeMainMsg.info);
        self._finalResult.next(completeMainMsg.result);
        self._finalResult.complete(); //do other tear down
        ;
        oResultMain.next(completeMainMsg);
        
        // provide a method to do this, else keep alive for more input
        // oResultMain.complete();
        
      });
    });
  });
    self._input = new rx.ReplaySubject(1);
    return self._obsResult;
    
  }
}

const processor = new ObservableDocProcessor();

/*
processor.obsResult.subscribe((x) => {
  x.forEach((objRes)=>{
    objRes.subscribe((res)=>{console.log('result;',res);})  
   })
});
*/
//processor.info.subscribe((x) => {console.log('info from the info sub',x)});

processor.finalResult.subscribe((x) => {console.log('FINAL RESULT',x)});

processor.obsResult.subscribe((x) => {
 
 // doSomethingWithProcessorData(x.processorData);
  //doSomethingWithFinalResult(x.result);
//  doSomethingWithInfo(x.info);
})  

processor.input =  ('ONE DOC');
processor.input.complete();
//processor.input =  ('ANOTHER DOC');
//processor.obsResult.subscribe((x) => {console.log(x);})
//processor.input =  ('YETTY ANOTHERY DOCCY');
processor.info.subscribe((x) => {console.log('info replayed after input complete:',x)});

//processor.input.next('YO!');
//processor.input =  ('googdby');
  
function doSomethingWithProcessorData(pData){

  console.log('P Data:', pData || 'NO PROCESSOR DATA')
}

function doSomethingWithInfo(info){

  console.log('info:', info)
}

function doSomethingWithFinalResult(result){

  console.log('result:', result || 'NO RESULT YET')
  
}