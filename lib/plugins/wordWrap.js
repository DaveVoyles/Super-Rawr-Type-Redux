/************************************************************************************
 * wordWrap.js
 * @Source: http://impactjs.com/forums/code/wrapping-text
 * @Usage:  http://impactjs.com/forums/help/how-would-i-implement-dialog-in-my-game
 ************************************************************************************/
ig.module(
	'plugins.wordWrap'
)
.requires(
)
.defines(function () {
    "use strict";

WordWrap = ig.Class.extend({

    text: "",
    maxWidth: 100,
    cut: false,

    init: function (text, maxWidth, cut) {
        this.text = text;
        this.maxWidth = maxWidth;
        this.cut = cut;
    },

    wrap: function () {
        var regex = '.{1,' + this.maxWidth + '}(\\s|$)' + (this.cut ? '|.{' + this.maxWidth + '}|.+$' : '|\\S+?(\\s|$)');
        return this.text.match(RegExp(regex, 'g')).join('\n');
    }

});

    var wrapper = new WordWrap('some length text', 25);
    wrapper.wrap();

});