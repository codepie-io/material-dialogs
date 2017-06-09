(function ($) {

    "use strict";

    var DATA_KEY = 'ca.dialog';
    var ESCAPE_KEY_CODE = 27;
    var EVENT_KEY = DATA_KEY+'.';

    var Event = {
        HIDE: EVENT_KEY+'hide',
        HIDDEN: EVENT_KEY+'hidden',
        SHOW: EVENT_KEY+'show',
        SHOWN: EVENT_KEY+'shown',
        RESIZE: EVENT_KEY+'resize',
        CLICK_DISMISS: EVENT_KEY+'click.dismiss',
        KEY_DOWN_DISMISS: EVENT_KEY+'keydown.dismiss',
        NEGATIVE_ACTION: EVENT_KEY+'dismissive.action',
        POSITIVE_ACTION: EVENT_KEY+'affirmative.action'
    };

    var Selector = {
        DIALOG: '.md-dialog',
        DATA_TOGGLE: '[data-toggle="dialog"]',
        DATA_DISMISS: '[data-dismiss="meow"]'
    };

    var MaterialDialog = function (){

        var MaterialDialog  = function(element, config) {
            this.$dialog = $(element);
            this.isShown_ = false;
            this.isBodyOverflowing_ = false;
            this.scrollBarWidth_ = 0;
            this.isAnimating_ = false;
            this.init(config);
        };

        MaterialDialog.prototype.VERSION = '1.0';


        MaterialDialog.prototype.Default = {
            backdrop: true,
            keyboard: true,
            show: true
        };

        MaterialDialog.prototype.Classes_ = {
            DIALOG_SURFACE: 'md-dialog__surface',
            SHADOW: 'md-dialog__shadow',
            IS_OPEN: 'md-dialog--open',
            IS_ANIMATING: 'md-dialog--animating',
            ACTION_BUTTON: 'md-dialog__action',
            BODY_CLASS: 'is-dialog-open',
            VIRTUAL_SCROLL: 'dialog-virtual-scroll'
        };

        MaterialDialog.prototype.init = function (config) {
            if(this.$dialog.length){
                this.config = $.extend({}, this.Default, config);
                this.$dialogSurface = this.$dialog.find('.'+this.Classes_.DIALOG_SURFACE);
                this.$dialogShadow = this.$dialog.find('.'+this.Classes_.SHADOW);
                this.boundShowDialog_ = this.show.bind(this);
                this.boundHideDialog_ = this.hide.bind(this);

                //this.boundIgnoreClicks = this.ignoreClick_.bind(this);
                this.boundNegativeAction_ = this.handleNegativeAction_.bind(this);
                this.boundPositiveAction_ = this.handlePositiveAction_.bind(this);
                this.boundDialogOnResize_ = this.handleDialogOnResize.bind(this);
                this.boundEscapeEvent_ = this.handleEscapeEvent_.bind(this);
                this.boundDismiss_ = this.dismiss.bind(this);
                this.boundOnTransitionEnd_ = this.onTransitionEnd_.bind(this);
                this.$dialogShadow.on('click',this.boundDismiss_);
                //this.$dialogSurface.on('click',this.boundIgnoreClicks);
                //this.setDismissBtn_();
                this.setActionBtn_();
                this.setEscapeEvent_();
                this.checkScrollBar_();
                this.setScrollBarWidth_();
                (this.config.show && config!=='string')?this.show():'';
            }
        };

        MaterialDialog.prototype.setActionBtn_ = function(){
            var negativeActionBtn = this.$dialog.find('[data-action="dismissive"]');
            var positiveActionBtn = this.$dialog.find('[data-action="affirmative"]');
            if(typeof negativeActionBtn !== typeof undefined){
                this.negativeActionBtn_ = negativeActionBtn;
                this.negativeActionBtn_.on('click', this.boundNegativeAction_);
            }
            if(typeof positiveActionBtn !== typeof undefined){
                this.positiveActionBtn_ = positiveActionBtn;
                this.positiveActionBtn_.on('click', this.boundPositiveAction_);
            }
        };

        MaterialDialog.prototype.handleNegativeAction_ = function(){
            this.$dialog.trigger(Event.NEGATIVE_ACTION);
            this.hide();
        };

        MaterialDialog.prototype.handlePositiveAction_ = function(){
            this.$dialog.trigger(Event.POSITIVE_ACTION);
            this.hide();
        };

        MaterialDialog.prototype.setDialogOnResize_ = function() {
            $(window).on(Event.RESIZE, this.boundDialogOnResize_);
        };

        MaterialDialog.prototype.unSetDialogOnResize_ = function() {
            $(window).unbind(Event.RESIZE, this.boundDialogOnResize_);
        };

        MaterialDialog.prototype.handleDialogOnResize = function(){
            this.adjustDialog_();
        };

        MaterialDialog.prototype.dismiss = function(e){
            if(!this.isShown_)
                return;
            this.$dialog.trigger(Event.CLICK_DISMISS);
            this.hide();
        };

        MaterialDialog.prototype.show = function () {
            if(this.isShown_)
                return;
            this.setScrollBarWidth_();
            this.$dialog.trigger(Event.SHOW);
            this.$dialog.addClass(this.Classes_.IS_ANIMATING).addClass(this.Classes_.IS_OPEN);
            this.isAnimating_ = true;
            this.$dialogShadow.on('transitionend', this.boundOnTransitionEnd_);
            this.$dialog.focus();
            this.setEscapeEvent_();
            this.setDialogOnResize_();
            this.isShown_ = true;
        };
        MaterialDialog.prototype['show'] = MaterialDialog.prototype.show;

        MaterialDialog.prototype.hide = function () {
            if(!this.isShown_ || this.isAnimating_)
                return;
            this.$dialog.addClass(this.Classes_.IS_ANIMATING).removeClass(this.Classes_.IS_OPEN);
            this.isAnimating_ = true;
            this.$dialogShadow.on('transitionend', this.boundOnTransitionEnd_);
            this.isShown_ = false;
            this.$dialog.trigger(Event.HIDE);
            this.unSetEscapeEvent_();
            this.unSetDialogOnResize_();
            $('body').removeClass(this.Classes_.BODY_CLASS);
            this.resetScrollBar_();
        };
        MaterialDialog.prototype['hide'] = MaterialDialog.prototype.hide;

        MaterialDialog.prototype.toggle = function () {
            this.isShown_? this.hide() : this.show();
        };
        MaterialDialog.prototype['toggle'] = MaterialDialog.prototype.toggle;

        MaterialDialog.prototype.onTransitionEnd_ = function () {
            this.$dialog.removeClass(this.Classes_.IS_ANIMATING);
            this.isAnimating_ = false;
            this.$dialogShadow.unbind('transitionend',this.boundOnTransitionEnd_);
            if(this.isShown_){
                this.$dialog.trigger(Event.SHOWN);
                this.$dialog.attr('aria-hidden', false);
            } else{
                this.$dialog.trigger(Event.HIDDEN);
                this.$dialog.attr('aria-hidden', true);
            }
        };

        MaterialDialog.prototype.getScrollBarWidth_ = function () {
            var scrollDiv = document.createElement('div');
            scrollDiv.className = this.Classes_.VIRTUAL_SCROLL;
            document.body.appendChild(scrollDiv);
            var scrollBarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
            document.body.removeChild(scrollDiv);
            return scrollBarWidth;
        };

        MaterialDialog.prototype.checkScrollBar_ = function () {
            this.isBodyOverflowing_ = document.body.clientWidth < window.innerWidth;
            console.log(this.isBodyOverflowing_);
            this.scrollBarWidth_ = this.getScrollBarWidth_();
        };

        MaterialDialog.prototype.setScrollBarWidth_ = function () {
            if (this.isBodyOverflowing_) {
                var actualPadding = document.body.style.paddingRight;
                if(actualPadding){
                    var calculatedPadding = $('body').css('padding-right');
                    $('body').data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + this.scrollBarWidth_ + 'px');
                }else{
                    $('body').css('padding-right', this.scrollBarWidth_ + 'px');
                }
            }
        };

        MaterialDialog.prototype.resetScrollBar_ = function (){
            var padding = $('body').data('padding-right');
            if (typeof padding !== 'undefined') {
                $('body').css('padding-right', padding).removeData('padding-right');
            }
            $('body').css('padding-right', '');
        };

        MaterialDialog.prototype.handleEscapeEvent_ = function (event) {
            if (event.keyCode == ESCAPE_KEY_CODE && this.isShown_) {
                event.preventDefault();
                this.$dialog.trigger(Event.KEY_DOWN_DISMISS);
                this.hide();
            }
        };

        MaterialDialog.prototype.setEscapeEvent_ = function() {
            if (this.config.keyboard)
                $(document).on('keyup',this.boundEscapeEvent_);
        };

        MaterialDialog.prototype.unSetEscapeEvent_ = function() {
            if (this.config.keyboard) {
                $(document).unbind('keyup',this.boundEscapeEvent_);
            }
        };

        MaterialDialog.prototype.adjustDialog_ = function() {
            var isDialogOverflowing = this.$dialog.get(0).scrollHeight > document.documentElement.clientHeight;

            if (!this.isBodyOverflowing_ && isDialogOverflowing) {
                this.$dialog.css('padding-left' , this.scrollBarWidth_ + 'px');
            }

            if (this.isBodyOverflowing_ && !isDialogOverflowing) {
                this.$dialog.css('padding-left', this.scrollBarWidth_ + 'px');
            }
        };

        MaterialDialog.prototype.setDismissBtn_ = function () {
            var $dismissButton = this.$dialog.find(Selector.DATA_DISMISS);
            if($dismissButton.length){
                $dismissButton.on('click',this.boundDismiss_);
            }
        };


        MaterialDialog.Plugin_ = function Plugin_(config) {
            return this.each(function () {
                var $this = $(this);
                var data  = $this.data(DATA_KEY);
                if (!data){
                    $this.data(DATA_KEY, (data = new MaterialDialog(this, config)));
                }
                if (typeof config === 'string') {
                    if (data[config] === undefined) {
                        throw new Error('No method named "' + config + '"');
                    }
                    data[config]();
                }
            });
        };
        return MaterialDialog;
    }();

    /**
     * -----------------------
     * Data Api
     * -----------------------
     */
    $(document).on('click', Selector.DATA_TOGGLE, function (event) {
        var $this = $(this);
        if (this.tagName === 'A') {
            event.preventDefault();
        }
        var target = $this.attr('data-target');
        if(typeof target === typeof undefined){
            throw new Error('Target Dialog not specified.');
            return;
        }
        var config = $(target).data(DATA_KEY) ? 'toggle' : $.extend({}, $(target).data(), $(this).data());
        MaterialDialog.Plugin_.call($(target), config);
    });
    $(document).on('click', Selector.DATA_DISMISS, function (event) {
        var $this = $(this);
        if (this.tagName === 'A') {
            event.preventDefault();
        }
        var $target = $this.closest(Selector.DIALOG);
        if(typeof $target === typeof undefined && $target.length != 0){
            return;
        }
        $target.data(DATA_KEY)?$target.data(DATA_KEY).dismiss():'';
    });
    $.fn.MaterialDialog = MaterialDialog.Plugin_;
    $.fn.MaterialDialog.Constructor = MaterialDialog;
    $.fn.MaterialDialog.noConflict = function () {
        $.fn.MaterialDialog = MaterialDialog;
        return MaterialDialog.Plugin_;
    };
}( jQuery ));