function SVGBuilder() {
  this.document = document.createElementNS("http://www.w3.org/2000/svg", "svg");
}

SVGBuilder.prototype.insert = function(container, wipe) {
  if (wipe) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }
  container.appendChild(this.document);
}

SVGBuilder.prototype.addRect = function(attr) {
  // Add new rect element
  console.log("Adding rect element, attr=", attr);
}

SVGBuilder.prototype.addCircle = function(attr) {
  // Add new circle element
  console.log("Adding circle element, attr=", attr);
}

SVGBuilder.prototype.addEllipse = function(attr) {
  // Add new ellipse element
  console.log("Adding ellipse element, attr=", attr);
}

SVGBuilder.prototype.addLine = function(attr) {
  // Add new line element
  console.log("Adding line element, attr=", attr);
}
