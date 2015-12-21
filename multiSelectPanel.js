;(function($) {
    //定义MultiSelectPanel的构造函数
    var MultiSelectPanel = function(ele, opt) {
        this.$element = ele;
        this.defaults = {
            title: '客服'
        };
        this.options = $.extend({}, this.defaults, opt);
    };
    function bindEvents($obj) {
        var elem = $obj.$element[0];
        $(elem).find('.itemSelectAll').on('click', function (e) {
            if (e.target.checked) {
                $('.itemCheckbox').prop('checked', true);
                $('.multiSelectPanel-right-panel-ul').empty();
                $('.itemCheckbox').parent().each(function () {
                    var $option = $(this).clone();
                    var $checkBox = $option.find('.itemCheckbox');
                    var id = $checkBox.attr('id');
                    $checkBox.attr('id', 'd' + id);
                    $checkBox.removeClass('itemCheckbox').addClass('itemDelCheckbox');
                    $option.appendTo('.multiSelectPanel-right-panel-ul');
                });
            } else {
                $('.itemCheckbox').prop('checked', false);
                $('.multiSelectPanel-right-panel-ul').empty();
            }
            renderNum($('.multiSelectPanel-left-bottom'), $('.multiSelectPanel-left-panel-ul'));
            renderNum($('.multiSelectPanel-right-bottom'), $('.multiSelectPanel-right-panel-ul'));
        });
        $(elem).find('.itemDeleteAll').on('click', function (e) {
            $('.multiSelectPanel-right-panel-ul').empty();
            $('.itemCheckbox').prop('checked', false);
            $('.itemSelectAll').prop('checked', false);
            renderNum($('.multiSelectPanel-left-bottom'), $('.multiSelectPanel-left-panel-ul'));
            renderNum($('.multiSelectPanel-right-bottom'), $('.multiSelectPanel-right-panel-ul'));
        });
        $(elem).find('.itemCheckbox').on('click', function (e) {
            if (e.target.checked) {
                var $option = $(this).parent().clone();
                var $checkBox = $option.find('.itemCheckbox');
                var id = $checkBox.attr('id');
                $('#d' + id).parent().remove();
                $checkBox.attr('id', 'd' + id);
                $checkBox.removeClass('itemCheckbox').addClass('itemDelCheckbox');
                $option.appendTo('.multiSelectPanel-right-panel-ul');
            } else {
                var id = $(this).attr('id');
                var deleteItem = $('#d' + id);
                deleteItem.parent().remove();
            }
            renderNum($('.multiSelectPanel-left-bottom'), $('.multiSelectPanel-left-panel-ul'));
            renderNum($('.multiSelectPanel-right-bottom'), $('.multiSelectPanel-right-panel-ul'));
        });
        $(elem).find('.itemDelCheckbox').on('click', function (e) {
            if (e.target.checked) {
                $(this).parent().remove();
            } else {
                var id = $(this).attr('id');
                var deleteItem = $('#d' + id);
                deleteItem.parent().remove();
            }
            renderNum($('.multiSelectPanel-left-bottom'), $('.multiSelectPanel-left-panel-ul'));
            renderNum($('.multiSelectPanel-right-bottom'), $('.multiSelectPanel-right-panel-ul'));
        });
    }
    function renderNum ($label, $panel) {
        var num = $panel.children().length;
        $label.find('.itemTotalNum').text(num);
    }
    function renderTitle ($obj) {
        $('.multiSelectPanel-left-title').text($obj.options.title);
        $('.multiSelectPanel-left-bottom-title').text($obj.options.title);
    }
    //定义MultiSelectPanel的方法
    MultiSelectPanel.prototype.init = function () {

        bindEvents(this);
        renderNum($('.multiSelectPanel-left-bottom'), $('.multiSelectPanel-left-panel-ul'));
        renderNum($('.multiSelectPanel-right-bottom'), $('.multiSelectPanel-right-panel-ul'));
        renderTitle(this);
    };
    MultiSelectPanel.prototype.show = function () {

        var elem = this.$element[0];
        $(elem).show();
    };
    MultiSelectPanel.prototype.hide = function () {

        var elem = this.$element[0];
        $(elem).hide();
    };
    MultiSelectPanel.prototype.toggle = function () {

        var elem = this.$element[0];
        $(elem).toggle();
    };
    //在插件中使用multiSelectPanel对象
    $.fn.multiSelectPanel = function(options) {
        //创建multiSelectPanel的实体
        var $msp = $('.multiSelectPanel');
        var multiSelectPanel = new MultiSelectPanel($msp, options);
        //调用其方法
        // return multiSelectPanel.init();
        multiSelectPanel.init();
        return multiSelectPanel;
    };
})(jQuery);