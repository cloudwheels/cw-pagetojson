/* eslint-disable require-jsdoc */
// RxJS
const rxjs = require('rxjs/Observable');

class DefaultElementProcessor {
  constructor() {
    this._obsResult = rxjs.Observable;
    this._input = null;
  }
  
  
  get input() {
    return this._docToConvert;
  }

  set input(newInput) {
    if (newInput) {
      this._input = newInput;
    }
  }

  get obsResult() {
    const self = this;
    return self._obsResult.create(async function(oResult) {
      const startMainMsg = 'element processot result observable started';
      oResult.next(startMainMsg);
      oResult.next('returning input');
      
        oResult.next(self._input);
      

      // eslint-disable-next-line max-len
      const completeElementProcessorMsg = 'element processor result observable completed - sending complete next...';
      oResult.next(completeElementProcessorMsg);
      oResult.complete();
    });
  }
}


class ObservableDocProcessor {
  constructor() {
    const self=this;
    self._input = null;
    self._obsResult = rxjs.Observable;
    self._defaultElementProcessor = DefaultElementProcessor;
    self._arrElementProcessors = [self._defaultElementProcessor];
    self._arrObsElementProcessorResults = [];
    self._results = {
      // eslint-disable-next-line max-len
      result: self._obsResult, elementResults: self._arrObsElementProcessorResults,
    };
  }

  get input() {
    return this._docToConvert;
  }

  set input(newInput) {
    if (newInput) {
      this._input = newInput;
    }
  }

  get obsResult() {
    const self = this;
    return self._obsResult.create(async function(oResultMain) {
      const startMainMsg = 'main result observable started';
      oResultMain.next(startMainMsg);
      oResultMain.next('invoking element processors');
      // find how to wait for these reults for the final reult and diferent stages
      // and pass this observable back to main function
      self._arrElementProcessors.forEach((elementProcessor)=>{
        elementProcessor = new elementProcessor(); // (typeof elementProcessor)();
        elementProcessor.input = self._input;
        elementProcessor.obsResult.subscribe((x) => console.log(x));
      });


      // eslint-disable-next-line max-len
      const completeMainMsg = 'main result observable completed - sending complete next...';
      oResultMain.next(completeMainMsg);
      oResultMain.complete();
    });
  }
}

const processor = new ObservableDocProcessor();
processor.input = 'hello world';
processor.obsResult.subscribe((x) => console.log(x));
