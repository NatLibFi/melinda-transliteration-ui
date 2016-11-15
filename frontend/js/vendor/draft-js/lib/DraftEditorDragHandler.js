/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule DraftEditorDragHandler
 * @typechecks
 * 
 */

'use strict';

var DataTransfer = require('fbjs/lib/DataTransfer');
var DraftModifier = require('./DraftModifier');
var EditorState = require('./EditorState');

var findAncestorOffsetKey = require('./findAncestorOffsetKey');
var getTextContentFromFiles = require('./getTextContentFromFiles');
var getUpdatedSelectionState = require('./getUpdatedSelectionState');
var nullthrows = require('fbjs/lib/nullthrows');

var isEventHandled = require('./isEventHandled');

/**
 * Get a SelectionState for the supplied mouse event.
 */
function getSelectionForEvent(event, editorState) {
  var node = null;
  var offset = null;

  if (typeof document.caretRangeFromPoint === 'function') {
    var dropRange = document.caretRangeFromPoint(event.x, event.y);
    node = dropRange.startContainer;
    offset = dropRange.startOffset;
  } else if (event.rangeParent) {
    node = event.rangeParent;
    offset = event.rangeOffset;
  } else {
    return null;
  }

  node = nullthrows(node);
  offset = nullthrows(offset);
  var offsetKey = nullthrows(findAncestorOffsetKey(node));

  return getUpdatedSelectionState(editorState, offsetKey, offset, offsetKey, offset);
}

var DraftEditorDragHandler = {
  /**
   * Drag originating from input terminated.
   */
  onDragEnd: function onDragEnd() {
    this.exitCurrentMode();
  },

  /**
   * Handle data being dropped.
   */
  onDrop: function onDrop(e) {
    var _this = this;

    var data = new DataTransfer(e.nativeEvent.dataTransfer);

    var editorState = this._latestEditorState;
    var dropSelection = getSelectionForEvent(e.nativeEvent, editorState);

    e.preventDefault();
    this.exitCurrentMode();

    if (dropSelection == null) {
      return;
    }

    var files = data.getFiles();
    if (files.length > 0) {
      if (this.props.handleDroppedFiles && isEventHandled(this.props.handleDroppedFiles(dropSelection, files))) {
        return;
      }

      getTextContentFromFiles(files, function (fileText) {
        fileText && _this.update(insertTextAtSelection(editorState, nullthrows(dropSelection), // flow wtf
        fileText));
      });
      return;
    }

    var dragType = this._internalDrag ? 'internal' : 'external';
    if (this.props.handleDrop && isEventHandled(this.props.handleDrop(dropSelection, data, dragType))) {
      return;
    }

    if (this._internalDrag) {
      this.update(moveText(editorState, dropSelection));
      return;
    }

    this.update(insertTextAtSelection(editorState, dropSelection, data.getText()));
  }

};

function moveText(editorState, targetSelection) {
  var newContentState = DraftModifier.moveText(editorState.getCurrentContent(), editorState.getSelection(), targetSelection);
  return EditorState.push(editorState, newContentState, 'insert-fragment');
}

/**
 * Insert text at a specified selection.
 */
function insertTextAtSelection(editorState, selection, text) {
  var newContentState = DraftModifier.insertText(editorState.getCurrentContent(), selection, text, editorState.getCurrentInlineStyle());
  return EditorState.push(editorState, newContentState, 'insert-fragment');
}

module.exports = DraftEditorDragHandler;