window.addEventListener('load', function() {
  var editor;

  ContentTools.StylePalette.add([
    new ContentTools.Style('Author', 'author', ['p']),
    new ContentTools.Style('Quote', 'blockquote', ['p']),
    new ContentTools.Style('Light Text', 'light-text', ['h1', 'h2', 'p'])
  ]);

  editor = ContentTools.EditorApp.get();
  editor.init('*[data-editable]', 'data-name');

  // editor.bind('save', function(regions, autoSave) {
  //   var saved;
  //   console.log(regions);
  //   editor.busy(true);
  //   saved = (function(_this) {
  //     return function() {
  //       editor.busy(false);
  //       return new ContentTools.FlashUI('ok');
  //     };
  //   })(this);
  //   return setTimeout(saved, 1000);
  // });


  // Patch the editor's start/stop methods to support auto-save
  var editorCls = ContentTools.EditorApp.getCls();

  editor.start = function () {
      var _this = this;

      // Call save every 30 seconds
      function autoSave() {
          _this.save(true, 'autoSave');
      };
      this.autoSaveTimer = setInterval(autoSave, 30 * 1000);

      // Start the editor
      editorCls.prototype.start.call(this);
  };
  editor.stop = function () {
      // Stop the autosave
      clearInterval(this.autoSaveTimer);

      // Stop the editor
      editorCls.prototype.start.call(this);
  }

  editor.bind('save', function (regions, calledBy) {
      var name, onStateChange, payload, xhr;

      // Set the editor as busy while we save our changes
      if (calledBy !== 'autoSave') {
          this.busy(true);
      }

      // Collect the contents of each region into a FormData instance
      payload = new FormData();
      payload.append('__page__', window.location.pathname);
      // payload.append(
      //   'product',
      //   document.querySelector('meta[name=product]').getAttribute('content')
      // );
      payload.append('regions', JSON.stringify(regions));

      // Send the update content to the server to be saved
      onStateChange = function(ev) {
          // Check if the request is finished
          if (ev.target.readyState == 4) {
              editor.busy(false);
              if (ev.target.status == '200') {
                  // Save was successful, notify the user with a flash
                  if (calledBy !== 'autoSave') {
                      new ContentTools.FlashUI('ok');
                  }
              } else {
                  // Save failed, notify the user with a flash
                  new ContentTools.FlashUI('no');
              }
          }
      };

      xhr = new XMLHttpRequest();
      xhr.addEventListener('readystatechange', onStateChange);
      xhr.open('POST', '/api/save');
      xhr.send(payload);
  });
});