const monaco = {
  editor: null,
  async initialize() {
    if (typeof window === 'undefined') return null;
    
    try {
      const m = await import('monaco-editor');
      this.editor = m;
      
      self.MonacoEnvironment = {
        getWorkerUrl: function (moduleId, label) {
          if (label === 'typescript' || label === 'javascript') {
            return '/_next/static/chunks/ts.worker.js';
          }
          return '/_next/static/chunks/editor.worker.js';
        }
      };
      
      return this.editor;
    } catch (error) {
      console.log('Monaco initialization skipped');
      return null;
    }
  }
};

module.exports = monaco;
