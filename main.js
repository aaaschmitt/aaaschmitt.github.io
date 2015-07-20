require.config({
  paths: {
    "react": "bower_components/react/react-with-addons",
    "JSXTransformer": "bower_components/react/JSXTransformer",
    "jsx": "bower_components/requirejs-react-jsx/jsx",
    "text": "bower_components/requirejs-text/text"
  },

  shim : {
    "react": {
      "exports": "React"
    },
    "JSXTransformer": "JSXTransformer"
  },

  config: {
    jsx: {
      fileExtension: ".jsx",
      transformOptions: {
        harmony: true,
        stripTypes: false,
        inlineSourceMap: true
      },
      usePragma: false
    }
  }
});

require(['jsx!src/main', 'jsx!src/test'], function(React){

  var React = React;

});

