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

SVGBuilder.prototype.addElement = function(elementName, attr, attrList) {
  var element = document.createElementNS("http://www.w3.org/2000/svg", elementName);
  attrList.forEach(function(attrName) {
    if (attrName in attr) {
      var attrValue = attr[attrName];
      if (attrValue === null) return;
      if (typeof(attrValue) === 'function') {
        element[attrName] = attrValue;
        return;
      }
      element.setAttribute(attrName, attrValue);
    }
  });
  this.document.appendChild(element);
}

SVGBuilder.prototype.addRect = function(attr) {
  // Add new rect element
  console.log("Adding rect element, attr=", attr);
  this.addElement("rect", attr, ["id", "style", "class", "x", "y", "width", "height", "rx", "ry", "fill", "stroke", "stroke-width", "onclick"]);
}

SVGBuilder.prototype.addCircle = function(attr) {
  // Add new circle element
  console.log("Adding circle element, attr=", attr);
  this.addElement("circle", attr, ["id", "style", "class", "cx", "cy", "r", "fill", "stroke", "stroke-width"]);
}

SVGBuilder.prototype.addEllipse = function(attr) {
  // Add new ellipse element
  console.log("Adding ellipse element, attr=", attr);
  this.addElement("ellipse", attr, ["id", "style", "class", "cx", "cy", "rx", "ry", "fill", "stroke", "stroke-width"]);
}

SVGBuilder.prototype.addLine = function(attr) {
  // Add new line element
  console.log("Adding line element, attr=", attr);
  this.addElement("line", attr, ["id", "style", "class", "x1", "y1", "x2", "y2", "stroke", "stroke-width"]);
}
