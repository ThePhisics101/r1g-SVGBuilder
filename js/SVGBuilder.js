function SVGBuilder() {
  this.document = document.createElement("div");
  this.document.innerHTML = "SVG"
}

SVGBuilder.prototype.insert = function(container, wipe) {
  if (wipe) {
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }
  container.appendChild(this.document);
}
