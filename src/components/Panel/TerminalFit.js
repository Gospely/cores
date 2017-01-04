import Xterm from 'xterm'

Xterm.prototype.proposeGeometry = function(splitType) {
  const parentElementStyle = window.getComputedStyle(this.element.parentElement);

  var parentElementHeight = 0;

  if(splitType == 'single' || splitType == 'vertical-dbl') {
    parentElementHeight = parseInt($('#devbar').height() - 32);
  }else {
    if(splitType == 'horizontal-dbl') {
      parentElementHeight = parseInt($('#devbar').height() / 2 - 46);
    }else {
      parentElementHeight = parseInt($('#devbar').height() / 2);
    }
  }

  const parentElementWidth = parseInt(parentElementStyle.getPropertyValue('width')),
      elementStyle = window.getComputedStyle(this.element),
      elementPaddingVer = parseInt(elementStyle.getPropertyValue('padding-top')) + parseInt(elementStyle.getPropertyValue('padding-bottom')),
      elementPaddingHor = parseInt(elementStyle.getPropertyValue('padding-right')) + parseInt(elementStyle.getPropertyValue('padding-left')),
      availableHeight = parentElementHeight - elementPaddingVer,
      availableWidth = parentElementWidth - elementPaddingHor,
      subjectRow = this.rowContainer.firstElementChild,
      contentBuffer = subjectRow.innerHTML;
  let characterHeight,
      rows,
      characterWidth,
      cols,
      geometry;

  subjectRow.style.display = 'inline'
  subjectRow.innerHTML = 'W'
  characterWidth = subjectRow.getBoundingClientRect().width
  subjectRow.style.display = ''
  characterHeight = parseInt(subjectRow.offsetHeight)
  subjectRow.innerHTML = contentBuffer

  rows = parseInt(availableHeight / characterHeight)
  cols = parseInt(availableWidth / characterWidth) - 1

  geometry = {cols: cols, rows: rows}
  return geometry
}

Xterm.prototype.fit = function(splitType) {
  const geometry = this.proposeGeometry(splitType)
  this.resize(geometry.cols, geometry.rows)
}

Xterm.prototype.attach = function (socket, bidirectional, buffered) {

  var attach = function(term, socket, bidirectional, buffered) {

    bidirectional = (typeof bidirectional == 'undefined') ? true : bidirectional;
    term.socket = socket;

    term._flushBuffer = function () {
      term.write(term._attachSocketBuffer);
      term._attachSocketBuffer = null;
      clearTimeout(term._attachSocketBufferTimer);
      term._attachSocketBufferTimer = null;
    };

    term._pushToBuffer = function (data) {
      if (term._attachSocketBuffer) {
        term._attachSocketBuffer += data;
      } else {
        term._attachSocketBuffer = data;
        setTimeout(term._flushBuffer, 10);
      }
    };

    term._getMessage = function (ev) {
      if (buffered) {
        term._pushToBuffer(ev.data);
      } else {
        term.write(ev.data);
      }
    };

    term._sendData = function (data) {
      socket.send(data);
    };

    socket.addEventListener('message', term._getMessage);

    if (bidirectional) {
      term.on('data', term._sendData);
    }

    socket.addEventListener('close', term.detach.bind(term, socket));
    socket.addEventListener('error', term.detach.bind(term, socket));

  }

  attach(this, socket, bidirectional, buffered);

};

Xterm.prototype.detach = function (socket) {

  var detach = function(term, socket) {

    term.off('data', term._sendData);

    socket = (typeof socket == 'undefined') ? term.socket : socket;

    if (socket) {
      socket.removeEventListener('message', term._getMessage);
    }

    delete term.socket;

  }

  detach(this, socket);

};

export default Xterm
