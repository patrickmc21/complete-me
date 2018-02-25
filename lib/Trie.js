const Node = require('./Node');

class Trie {
  constructor () {
    this.count = 0;
    this.children = {};
  }

  insert(word) {
  if(!parseInt(word)) {
      let splitWord = word.split('');
      let currentNode = this.children;

      while (splitWord.length) {
        let currentLetter = splitWord.shift();

        if (!currentNode[currentLetter]) {
          currentNode[currentLetter] = new Node();
        }
        if (!splitWord.length) {
          if (!currentNode[currentLetter].completeWord) {
            this.count++;
            currentNode[currentLetter].completeWord = word;
          }
        }
        currentNode = currentNode[currentLetter].children;
      }
    }
  }

  suggest(prefix) {
    let suggestions = [];
    if(!parseInt(prefix) || prefix.length === 0) {
      let currentNode = this.findLastKnownNode(prefix);

      if (currentNode.children) {
        if (!currentNode) {
          return suggestions;
        }
        if (currentNode === null) {
          return suggestions;
        } else if (currentNode.completeWord) {
          if (currentNode.priority > 0) {
            suggestions.unshift(currentNode.completeWord);
          } else {
            suggestions.push(currentNode.completeWord);
          }
        }

        let letterOptions  = Object.keys(currentNode.children);

        suggestions = this.findWords(letterOptions, currentNode.children, suggestions);
      } 
    }
    return suggestions
  }

  findWords(keysArray, nodeLevel, suggestions) {
    keysArray.forEach(letter => {
      let recursiveNode = nodeLevel;

      if (recursiveNode[letter].completeWord) {
        if (recursiveNode[letter].priority  === 0) {
          suggestions.push(recursiveNode[letter].completeWord);
        } else {
          suggestions.unshift(recursiveNode[letter].completeWord);
        }
      }
      if (Object.keys(recursiveNode[letter].children).length) {
        recursiveNode = recursiveNode[letter].children;
        this.findWords(Object.keys(recursiveNode), recursiveNode, suggestions);
      }
    });
    return suggestions;
  }

  findLastKnownNode(prefix) {
    let letters = prefix.split('');
    let currentNode = this.children;

    if (!currentNode[letters[0]]) {
      currentNode[letters[0]] = new Node();
    }
    while (letters.length) {
      let currentLetter = letters.shift();

      if (Object.keys(currentNode).find(letter => letter === currentLetter)) {
        if (letters.length === 0) {
          return currentNode[currentLetter];
        } else {
          currentNode = currentNode[currentLetter].children;
        }
      } else {
        currentNode[currentLetter] = new Node();
      } 
    }
    return currentNode;
  }

  populate(array) {
    array.forEach(word => {
      this.insert(word);
    });
  }

  select(string) {
    if(!parseInt(string)) {
      let letters = string.split('');

      this.traverseDownward(letters)[letters[0]].priority++;
    }
  }

  delete(string) {
    if(!parseInt(string)) {
      let letters = string.split('');
      
      this.count--;
      this.traverseDownward(letters)[letters[0]].completeWord = false;
    }
  }

  traverseDownward(array) {
    let currentLevel = this.children;

    while (array.length > 1) {
      let currentLetter = array.shift();

      if (Object.keys(currentLevel).find(letter => letter === currentLetter)) {
        currentLevel = currentLevel[currentLetter].children;
      }
    }
    return currentLevel;
  }
}

module.exports = Trie;


