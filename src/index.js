function eval() {
    // Do not use eval!!!
    return;
  };
  
  function expressionCalculator(expr) {
  
    function convertToArray(string) {
      const array = string.split('').filter(el => el !== ' ');
      const clone = [];
      const symbols = ['(', ')', '/', '*', '-', '+'];
      let num = '';
  
      for (let i = 0; i < array.length; i++) {
        const current = array[i];
        if (symbols.includes(current)) {
          if (num.length !== 0) {
            clone.push(num);
            num = '';
          };
  
          clone.push(current);
        };
  
        if (Number(current) === Number(current)) {
          num += current;
  
          if (i === array.length - 1) {
            clone.push(num);
            num = '';
          };
        };
      };
  
      return clone;
    };
  
    const array = convertToArray(expr);
  
    (function bracketChecker(array) {
      let counter = 0;
      for (let i = 0; i < array.length; i++) {
        const current = array[i];
        if (current === '(') counter++;
        if (current === ')') counter--;
      };
  
      if (counter !== 0) throw "ExpressionError: Brackets must be paired";
    })(array);
  
    function evaluate(left, sign, right) {
      if (Number(left) !== Number(left)) return false;
      if (Number(right) !== Number(right)) return false;
  
      const leftX = Number(left);
      const rightX = Number(right);
  
      if (sign === '/') {
        if (rightX === 0) throw "TypeError: Division by zero.";
        return leftX / rightX;
      };
  
      if (sign === '*') return leftX * rightX;
      if (sign === '-') return leftX - rightX;
      if (sign === '+') return leftX + rightX;
  
      return false;
    };
  
  
    function findDeepLevel(array) {
      let start = null;
      let end = null;
  
      for (let i = 0; i < array.length; i++) {
        const current = array[i];
        if (current === '(') start = i;
        if (current === ')') {
          end = i;
          break;
        };
      };
  
      if ((start || start === 0) && end) {
  
        array.splice(start, 1);
        array.splice(end - 1, 1);
        return array;
      };
  
      return false;
    };
  
    function evaluator(array) {
      let results;
  
      function divEval(array) {
        let divFlag;
  
        do {
          divFlag = false;
  
          for (let i = 0; i < array.length; i++) {
            const current = array[i];
            const left = array[i - 1];
            const right = array[i + 1];
  
            if (current === '/') {
              if (Number(left) === Number(left) && Number(right) === Number(right)) {
                if (array[i - 2] === '/') {
                  const result = evaluate(left, '*', right);
                  array.splice(i - 1, 3, result);
                  divFlag = true;
                  break;
                };
  
                const result = evaluate(left, '/', right);
                array.splice(i - 1, 3, result);
                divFlag = true;
                break;
              };
            };
          };
        } while (divFlag);
  
        return array;
      };
  
      results = divEval(array);
  
      function mulEval(array) {
        let mulFlag;
  
        do {
          mulFlag = false;
  
          for (let i = 0; i < array.length; i++) {
            const current = array[i];
            const left = array[i - 1];
            const right = array[i + 1];
  
            if (current === '*') {
              if (Number(left) === Number(left) && Number(right) === Number(right)) {
                if (array[i - 2] === '/') {
                  const result = evaluate(left, '/', right);
                  array.splice(i - 1, 3, result);
                  mulFlag = true;
                  break;
                };
  
                const result = evaluate(left, '*', right);
                array.splice(i - 1, 3, result);
                mulFlag = true;
                break;
              };
            };
          };
        } while (mulFlag);
  
        return array;
      };
  
      results = mulEval(array);
  
      function simpleEval(array) {
        let simpleFlag;
  
        do {
          simpleFlag = false;
  
          for (let i = 0; i < array.length; i++) {
            const current = array[i];
            const left = array[i - 1];
            const right = array[i + 1];
  
            if (current === '+' || current === '-') {
              if (Number(left) === Number(left) && Number(right) === Number(right)) {
  
                if (current === '+' && array[i + 2] !== '*' && array[i + 2] !== '/' && array[i - 2] !== '*' && array[i - 2] !== '/') {
                  if (array[i - 2] === '-') {
                    const result = evaluate(left, '-', right);
                    array.splice(i - 1, 3, result);
                    simpleFlag = true;
                    break;
                  };
  
                  const result = evaluate(left, '+', right);
                  array.splice(i - 1, 3, result);
                  simpleFlag = true;
                  break;
                };
  
                if (current === '-' && array[i + 2] !== '*' && array[i + 2] !== '/' && array[i - 2] !== '*' && array[i - 2] !== '/') {
                  if (array[i - 2] === '-') {
                    const result = evaluate(left, '+', right);
                    array.splice(i - 1, 3, result);
                    simpleFlag = true;
                    break;
                  };
  
                  const result = evaluate(left, '-', right);
                  array.splice(i - 1, 3, result);
                  simpleFlag = true;
                  break;
                };
  
              };
            };
          };
        } while (simpleFlag);
  
        return array;
      };
  
      results = simpleEval(array);
      let wasFound;
  
      do {
        wasFound = findDeepLevel(results);
  
        if (wasFound) {
          results = divEval(wasFound);
          results = mulEval(wasFound);
          results = simpleEval(wasFound);
        };
  
      } while (wasFound)
  
      return results;
    };
  
    const results = evaluator(array);
  
    return results[0] % 1 === 0 ? results[0] : parseFloat(results[0].toFixed(4).toString());
  
  };
  
  module.exports = {
    expressionCalculator
  }
  