/* class SVGContainer *************************************************************************************************************************/

function SVGContainer() {
  // Superclass constructor
}

SVGContainer.prototype.addElement = function(elementName, attr, attrList, nodeValue) {
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
    if (nodeValue !== undefined) element.innerHTML = nodeValue;
  });
  this.root.appendChild(element);
  return element;
}

SVGContainer.prototype.addRect = function(attr) {
  // Add new rect element
  console.log("Adding rect element, attr=", attr);
  this.addElement("rect", attr, ["id", "style", "class", "x", "y", "width", "height", "rx", "ry", "fill", "stroke", "stroke-width", "onclick"]);
}

SVGContainer.prototype.addCircle = function(attr) {
  // Add new circle element
  console.log("Adding circle element, attr=", attr);
  this.addElement("circle", attr, ["id", "style", "class", "cx", "cy", "r", "fill", "stroke", "stroke-width"]);
}

SVGContainer.prototype.addEllipse = function(attr) {
  // Add new ellipse element
  console.log("Adding ellipse element, attr=", attr);
  this.addElement("ellipse", attr, ["id", "style", "class", "cx", "cy", "rx", "ry", "fill", "stroke", "stroke-width"]);
}

SVGContainer.prototype.addLine = function(attr) {
  // Add new line element
  console.log("Adding line element, attr=", attr);
  this.addElement("line", attr, ["id", "style", "class", "x1", "y1", "x2", "y2", "stroke", "stroke-width"]);
}

SVGContainer.prototype.addText = function(attr, value) {
  this.addElement("text", attr, ["id", "style", "class", "x", "y", "fill"], value);
}

SVGContainer.prototype.addGroup = function(attr) {
  if (!attr) attr = {};
  var svgG = this.addElement("g", attr, ["id", "style", "class", "fill", "stroke", "stroke-width"]);
  var g = new SVGGroup(svgG);
  return g;
}

/* class SVGBuilder *************************************************************************************************************************/

function SVGBuilder() {
  this.root = document.createElementNS("http://www.w3.org/2000/svg", "svg");
}

// Inherit from SVGContainer
SVGBuilder.prototype = new SVGContainer();

SVGBuilder.prototype.insert = function(container, wipe) {
  if (wipe) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }
  container.appendChild(this.root);
}

/* class SVGGroup *************************************************************************************************************************/

function SVGGroup(root) {
  this.root = root;
}

// Inherit from SVGContainer
SVGGroup.prototype = new SVGContainer();

SVGGroup.prototype.getTransform = function(template) {
  if (!this.transform) this.transform = new SVGTransform(this.root, template);
  return this.transform;
}

SVGGroup.prototype.translate = function(x, y) {
  var t = this.getTransform("translate+rotate");
  if (t.template == "translate+rotate") {
    t.list[0].params = [x, y];
    t.apply();
  }
}

SVGGroup.prototype.rotate = function(angle, cx, cy) {
  var t = this.getTransform("translate+rotate");
  if (t.template == "translate+rotate") {
    t.list[1].params = [angle, cx, cy];
    t.apply();
  }
}

/* class SVGTransform *********************************************************************************************************************/

function SVGTransform(targetNode, template) {
  this.targetNode = targetNode;
  this.list = []; // List of transform definitions
  switch (template) {
    case "translate+rotate":
      this.addDefinition("translate", [0, 0]);
      this.addDefinition("rotate", [0, 0, 0]);
      this.template = template;
      break;
  }
  this.template = template ? template : null;
}

SVGTransform.prototype.addDefinition = function(fn, params, apply) {
  if (this.template) return;
  if (!["matrix", "translate", "scale", "rotate", "skewX", "skewY"].includes(fn)) return;
  this.list.push({
    fn    : fn,
    params: params
  });
  if (apply) this.apply();
}

SVGTransform.prototype.clear = function(apply) {
  this.list = [];
  this.template = null;
  if (apply) this.apply();
}

SVGTransform.prototype.apply = function() {
  var transformList = [];
  this.list.forEach(function(definition) {
    transformList.push(definition.fn + "(" + definition.params.join(" ") + ")");
  });
  this.targetNode.setAttribute("transform", transformList.join(" "));
}