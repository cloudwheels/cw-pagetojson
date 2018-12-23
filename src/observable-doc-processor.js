/* eslint-disable require-jsdoc */
// RxJS
const rxjs = require('rxjs/Observable');
const Observer = require('rxjs/Observer');
const rx = require('rxjs');
//con'rxjs/observable/concat
const defer = require('rxjs/add/observable/defer');


class DefaultElementProcessor {
  constructor() {
    const self=this;
    self._input = new rx.ReplaySubject();
    self._input.next('init');
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
    self._input = new rx.ReplaySubject();
    self._input.next('init');
    self._previousOutput = false;
    self._obsResult = rxjs.Observable;
    self._defaultElementProcessor = DefaultElementProcessor;
    self._arrElementProcessors = [self._defaultElementProcessor];
    self._arrObsElementProcessorResults = [];
    self._results = {
      // eslint-disable-next-line max-len
      result: self._obsResult, elementResults: self._arrObsElementProcessorResults,
    };
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
      return rxjs.Observable.create(async function(oResultMain) {
        self._input.subscribe((observedInput)=>{
        // var EPObsResSub = null;
        // var arrEPObsResSubs = [];
        const startMainMsg = 'main result observable started';
        oResultMain.next(startMainMsg);
        oResultMain.next('invoking element processors');
        // find how to wait for these reults for the final reult and diferent stages
        // and pass this observable back to main function
        self._previousOutput = false;
        self._arrElementProcessors.forEach((elementProcessor)=>{
          let eP = new elementProcessor(); // (typeof elementProcessor)();
          eP.input = self._previousOutput || observedInput;
          let thisOutput = eP.obsResult; //.subscribe((x) => console.log(x));
          self._previousOutput = thisOutput;
        });
        self._previousOutput.subscribe((x) => console.log('internal subscription:',x));
        // eslint-disable-next-line max-len
        const completeMainMsg = 'main result observable completed - sending complete next...';
        oResultMain.next(completeMainMsg);
       // oResultMain.complete();
      });
    });
  });
    return self._obsResult;
  }
}

const processor = new ObservableDocProcessor();
processor.input =  ('something I haven\'t subcribed to yet');
processor.obsResult.subscribe((x) => console.log('result;',x));
processor.input.next('YO!');
processor.input =  ('googdby');
  
