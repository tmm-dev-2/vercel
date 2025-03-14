"use strict";

if (typeof window !== 'undefined') {
  self.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
      if (label === 'typescript' || label === 'javascript') {
        return '/_next/static/chunks/ts.worker.js';
      }
      return '/_next/static/chunks/editor.worker.js';
    }
  };
}

const monaco = {
  editor: null,
  async initialize() {
    if (typeof window === 'undefined') return null;
    
    try {
      const m = await import('monaco-editor');
      this.editor = m;
      return this.editor;
    } catch (error) {
      console.log('Monaco initialization skipped');
      return null;
    }
  }
};

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept();
}

module.exports = monaco;
