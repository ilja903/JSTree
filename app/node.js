function Node(name, id) {
    this.name = name;
    this.parentNode = null;
    this.id = id;
    this.childNodes = [];

    var that = this;

    this.getHtml = function () {
        var html = startingDiv();
        html += '<span class="collapse-indicator"></span>';
        if (this.isSuperNode()) {
            html += '<span class="node-name super-node-name">' + name + '</span>';
        } else {
            html += '<span class="node-name sub-node-name">' + name + '</span>';
        }

        html += '<span class="add-node"></span><span class="edit-node"></span><span class="remove-node"></span>';
        if (this.hasChildNodes()) {
            for (var i = 0; i < this.childNodes.length; i++) {
                var node = this.childNodes[i];
                html += node.getHtml();
            }
        }
        html += '</div>';
        return html;

        function startingDiv() {
            var html = '<div data-node-id="' + that.id + '" class="node ';
            html += that.isSuperNode() ? 'super-node' : 'sub-node';
            html += '">';
            return html;
        }
    };

    this.addChild = function (child) {
        child.parentNode = that;
        this.childNodes.push(child);
    };

    this.isSuperNode = function() {
        return !that.parentNode;
    };

    this.hasChildNodes = function() {
        return that.childNodes.length != 0;
    };

    this.doesNotHaveId = function() {
        return !that.id;
    }
}
