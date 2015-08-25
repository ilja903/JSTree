var AddNodeView = Backbone.View.extend({
    DOM: DOMHelper,

    initialize: function (options) {
        this.registry = options.registry;
    },

    events: {
        'click .insert-new-node-save-button': 'save',
        'click .insert-new-node-cancel-button': 'cancel'
    },

    render: function () {
        var node = this.el;
        if (this.DOM.newFolderFormDoesNotExist(node)) {
            this.createNewForm(node);
        }
        this.DOM.openTreeViaCollapseIcon(this.DOM.getCollapseIconOfNode(node));
        this.newNodeForm = this.$el.find('.insert-new-node')[0];
    },

    createNewForm: function (node) {
        this.DOM.removeEditOrNewNodeForm(node);
        var newFolderForm = this.DOM.createNewFolderForm();
        var firstSubNodeOfNode = this.DOM.getFirstSubNodeOfNode(node);
        node.insertBefore(newFolderForm, firstSubNodeOfNode);
    },

    save: function () {
        var newNode = this.createNode(this.newNodeForm);
        new NodeView({el: newNode, registry: this.registry});
        this.newNodeForm.remove();
    },

    createNode: function () {
        var parentNode = this.DOM.getNodeOfNewFolderForm(this.newNodeForm);
        var parentNodeId = this.DOM.getNodeDataId(parentNode);
        var newNodeName = this.DOM.getNodeNameOfNewFolderForm(this.newNodeForm);
        var newNodeObject = this.registry.createNode(newNodeName);
        var parentNodeObject = this.registry.getNodeById(parentNodeId);
        parentNodeObject.addChild(newNodeObject);
        this.registry.save();
        this.DOM.insertHtmlAfterNewFolderForm(this.newNodeForm, newNodeObject.getHtml());
        return this.DOM.getFirstSubNodeOfNode(parentNode);
    },

    cancel: function () {
        this.newNodeForm.remove();
    }

});
