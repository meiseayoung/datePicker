define(["BaseComponent"],function(BaseComponent){
	var PopupContainer = BaseComponent.extend({
		init:function(opts){
			var defaultConfig = {
				top:0,
				left:0
			};
			this.config = $.extend({},defaultConfig,opts);
			var $containerHTML = $("<div style='width:100%;position:absolute;left:0;top:0;'></div>");
			this.element = $containerHTML;
			$("body").append($containerHTML);
		},
		/**
		 * 添加容器内容
		 * @params {[jQuery Object || String || DOMNODE]} content 容器内容
		 * 
		 **/
		addContent:function(content){
			this.element.empty();
			this.element.append(content || "");
		},
		/**
		 * 显示容器 
		 * @params {[Number]} left pageX 
		 * @params {[Number]} top  pageY
		 * 
		 **/
		show:function(left,top){
			this.element.css({
				top:top || 0,
				left:left || 0,
			});
			this.element.show();
		},
		/**
		 * 隐藏容器
		 *
		 **/
		hide:function(){
			this.element.hide();
		},
		/**
		 *
		 *
		 *
		 **/
		setPosition:function(left,top){

		}
	}); 
	return PopupContainer;
});