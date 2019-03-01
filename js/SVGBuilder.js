/* class SVGContainer *************************************************************************************************************************/

class SVGContainer {
  root;
  // Superclass constructor

  addElement(elementName, attr, attrList, nodeValue) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", elementName);
    attrList.forEach(function (attrName) {
      if (attrName in attr) {
        const attrValue = attr[attrName];
        if (attrValue === null) return;
        if (typeof (attrValue) === 'function') {
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

  addRect(attr) {
    // Add new rect element
    console.log("Adding rect element, attr=", attr);
    this.addElement("rect", attr, ["id", "style", "class", "x", "y", "width", "height", "rx", "ry", "fill", "stroke", "stroke-width", "onclick"]);
  }

  addCircle(attr) {
    // Add new circle element
    console.log("Adding circle element, attr=", attr);
    this.addElement("circle", attr, ["id", "style", "class", "cx", "cy", "r", "fill", "stroke", "stroke-width"]);
  }

  addEllipse(attr) {
    // Add new ellipse element
    console.log("Adding ellipse element, attr=", attr);
    this.addElement("ellipse", attr, ["id", "style", "class", "cx", "cy", "rx", "ry", "fill", "stroke", "stroke-width"]);
  }

  addLine(attr) {
    // Add new line element
    console.log("Adding line element, attr=", attr);
    this.addElement("line", attr, ["id", "style", "class", "x1", "y1", "x2", "y2", "stroke", "stroke-width"]);
  }

  addText(attr, value) {
    this.addElement("text", attr, ["id", "style", "class", "x", "y", "fill"], value);
  }

  addGroup(attr) {
    if (!attr) attr = {};
    const svgG = this.addElement("g", attr, ["id", "style", "class", "fill", "stroke", "stroke-width"]);
    return new SVGGroup(svgG);
  }
}

/* class SVGBuilder *************************************************************************************************************************/

class SVGBuilder extends SVGContainer {
  constructor() {
    super();
    this.root = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  }


  insert(container, wipe) {
    if (wipe) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    }
    container.appendChild(this.root);
  }
}

/* class SVGGroup *************************************************************************************************************************/

class SVGGroup extends  SVGContainer {
  constructor(root) {
    super();
    this.root = root;
  }

  getTransform(template) {
    if (!this.transform) this.transform = new SVGTransform(this.root, template);
    return this.transform;
  }

  translate(x, y) {
    const t = this.getTransform("translate+rotate");
    if (t.template === "translate+rotate") {
      t.list[0].params = [x, y];
      t.apply();
    }
  }

  rotate(angle, cx, cy) {
    const t = this.getTransform("translate+rotate");
    if (t.template === "translate+rotate") {
      t.list[1].params = [angle, cx, cy];
      t.apply();
    }
  }
}

/* class SVGTransform *********************************************************************************************************************/

class SVGTransform {
  constructor(targetNode, template) {
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

  addDefinition(fn, params, apply) {
    if (this.template) return;
    if (!["matrix", "translate", "scale", "rotate", "skewX", "skewY"].includes(fn)) return;
    this.list.push({
      fn: fn,
      params: params
    });
    if (apply) this.apply();
  }

  clear(apply) {
    this.list = [];
    this.template = null;
    if (apply) this.apply();
  }

  apply() {
    const transformList = [];
    this.list.forEach(function (definition) {
      transformList.push(definition.fn + "(" + definition.params.join(" ") + ")");
    });
    this.targetNode.setAttribute("transform", transformList.join(" "));
  }
}