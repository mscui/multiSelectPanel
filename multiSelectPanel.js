/* 不同的panel需要不同的option，option必须的参数：name,title,data(左边的内容),selectlist(右边的内容);isShowBtn(可选，默认是true)
// html页面
<div class="panel-sale">
    {%widget
        name="business-end:widget/multiSelectPanel/multiSelectPanel.tpl"
    %}
</div>

// js
// 新建时候的逻辑
var options = {
    name: 'sale',
    title: '销售',
    // data: {
    //     list:[{ucid:'123',name:'销售1'},{ucid:'223',name:'销售2'},{ucid:'323',name:'销售3'},{ucid:'423',name:'销售4'}],
    //     selectlist: []
    // },
    isShowBtn: false
};
var panelSale = $('.panel-sale').multiSelectPanel(options);
*/
;(function ($) {
    // 定义MultiSelectPanel的构造函数
    var MultiSelectPanel = function (ele, opt) {
        this.$element = ele;
        this.$obj = $(this.$element[0]);
        this.leftPanel = this.$obj.find('.multiSelectPanel-left-panel');
        this.rightPanel = this.$obj.find('.multiSelectPanel-right-panel');
        this.leftTop = this.$obj.find('.multiSelectPanel-left-top');
        this.rightTop = this.$obj.find('.multiSelectPanel-right-top');
        this.defaults = {
            title: '客服',
            data: {},
            getCusUrl: '',
            getSaleUrl: '',
            isShowBtn: true
        };
        this.options = $.extend({}, this.defaults, opt);
    };
    function bindEvents($obj, elem) {

        $(document).on('click', '#allItem' + $obj.options.name, function (e) {
            if (e.target.checked) {
                $(this).parent().siblings().find('.itemCheckbox').prop('checked', true);
                $obj.rightPanelUl.empty();
                $(elem).find('.multiSelectPanel-left-panel-ul li').each(function () {
                    var $option = $(this).clone();
                    var $checkBox = $option.find('.itemCheckbox');
                    var id = $checkBox.attr('id');
                    $checkBox.attr('id', 'd' + id);
                    $checkBox.removeClass('itemCheckbox').addClass('itemDelCheckbox');
                    $obj.rightPanelUl.append($option);
                });
            } else {
                $(elem).find('.itemCheckbox').prop('checked', false);
                $obj.rightPanelUl.empty();
            }
            renderNum($obj.bottomLeftPanel, $obj.bottomLeftUl);
            renderNum($obj.bottomRightPanel, $obj.bottomRightUl);
        });
        $(document).on('click', '#deleteItem' + $obj.options.name, function (e) {
            $obj.rightPanelUl.empty();
            $(elem).find('.itemCheckbox').prop('checked', false);
            $obj.itemSelectAll.prop('checked', false);
            renderNum($obj.bottomLeftPanel, $obj.bottomLeftUl);
            renderNum($obj.bottomRightPanel, $obj.bottomRightUl);
        });
        $(elem).find('.itemCheckbox').on('click', function (e) {
            if (e.target.checked) {
                var $option = $(this).parent().clone();
                var $checkBox = $option.find('.itemCheckbox');
                var id = $checkBox.attr('id');
                $('#d' + id).parent().remove();
                $checkBox.attr('id', 'd' + id);
                $checkBox.removeClass('itemCheckbox').addClass('itemDelCheckbox');
                $obj.rightPanelUl.append($option);
            } else {
                var id = $(this).attr('id');
                var deleteItem = $('#d' + id);
                deleteItem.parent().remove();
            }
            renderNum($obj.bottomLeftPanel, $obj.bottomLeftUl);
            renderNum($obj.bottomRightPanel, $obj.bottomRightUl);
        });
        $(elem).find('.itemDelCheckbox').on('click', function (e) {
            if (e.target.checked) {
                $(this).parent().remove();
            } else {
                var id = $(this).attr('id');
                var deleteItem = $('#d' + id);
                deleteItem.parent().remove();
            }
            renderNum($obj.bottomLeftPanel, $obj.bottomLeftUl);
            renderNum($obj.bottomRightPanel, $obj.bottomRightUl);
        });
    }
    function renderNum($panel, $label) {
        var num = $label.children().length;
        $panel.find('.itemTotalNum').text(num);
    }
    function renderTitle($elem) {
        $elem.leftTitle.text($elem.options.title);
        $elem.leftBottomTitle.text($elem.options.title);
    }
    function renderList($obj) {
        var html = '<ul class="multiSelectPanel-left-panel-ul">'
                + '{{ for (var i = 0,len = list.length; i < len; i++) { }}'
                + '<li data-id="{{= list[i].ucid}}">{{=list[i].name}}'
                + '<input type="checkbox" class="itemCheckbox" id="{{=list[i].ucid}}"/>'
                + '<label for="{{=list[i].ucid}}"></label></li>'
                + '{{ } }}'
                + '</ul>';
        var tmp = _.template(html);
        var result = tmp($obj.options.data);
        $obj.leftPanel.html(result);
    }
    function renderSelectList($obj) {
        var html = '<ul class="multiSelectPanel-right-panel-ul">'
                + '{{ for (var i = 0,len = selectlist.length; i < len; i++) { }}'
                + '<li data-id="{{= selectlist[i].ucid}}">{{=selectlist[i].name}}'
                + '<input type="checkbox" class="itemDelCheckbox" id="{{= "d" + selectlist[i].ucid}}"/>'
                + '<label for="{{="d" + selectlist[i].ucid}}"></label></li>'
                + '{{ } }}'
                + '</ul>';
        var tmp = _.template(html);
        var result = tmp($obj.options.data);
        $obj.rightPanel.html(result);
    }
    function renderLeftCheckbox($obj) {
        var html = '<span class="multiSelectPanel-left-title"></span>'
                + '<input type="checkbox" class="itemSelectAll" id="{{="allItem" + name}}"/>'
                + '<label for="{{="allItem" + name}}"></label>';

        var tmp = _.template(html);
        var result = tmp($obj.options);
        $obj.leftTop.html(result);
    }
    function renderRightCheckbox($obj) {
        var html = '<span class="multiSelectPanel-title">已选择</span>'
                + '<input type="checkbox" class="itemDeleteAll" id="{{="deleteItem" + name}}"/>'
                + '<label for="{{="deleteItem" + name}}"></label>';

        var tmp = _.template(html);
        var result = tmp($obj.options);
        $obj.rightTop.html(result);
    }
    function showBtn($obj, elem) {
        if ($obj.options.isShowBtn) {
            $(elem).find('.multiSelectPanel').height('358px');
            $(elem).find('.multiSelectPanel-bottom').show();
            $(elem).find('.multiSelectPanel-saveItem').css('display', 'inline-block');
            $(elem).find('.multiSelectPanel-cancleItem').css('display', 'inline-block');
        }
    }
    function searchFun(elem, opt) {
        var searchTxt = $(elem).val();
        var liElem = $(elem).parent().siblings('.multiSelectPanel-' + opt + '-panel').children().children();
        if (searchTxt !== '') {
            var searchItem = liElem.filter(':contains("' + searchTxt + '")');

            liElem.hide();

            if (searchItem.length > 0) {
                searchItem.show();
            }

        } else {
            liElem.show();
        }
    }
    function searchItem(elem) {
        $(elem).find('.multiSelectPanel-left-searchBox-btn').on('click', function (e) {
            e.preventDefault();
            var inputObj = $(this).siblings();
            searchFun(inputObj, 'left');
        });
        $(elem).find('.multiSelectPanel-left-searchBox').keypress(function (e) {
            if (e.which === 13) {
                searchFun(this, 'left');
            }
        });
        $(elem).find('.multiSelectPanel-right-searchBox-btn').on('click', function (e) {
            e.preventDefault();
            var inputObj = $(this).siblings();
            searchFun(inputObj, 'right');
        });
        $(elem).find('.multiSelectPanel-right-searchBox').keypress(function (e) {
            if (e.which === 13) {
                searchFun(this, 'right');
            }
        });
    }
    // 定义MultiSelectPanel的方法
    MultiSelectPanel.prototype.init = function (elem) {

        renderList(this);
        renderSelectList(this);
        renderLeftCheckbox(this);
        renderRightCheckbox(this);

        this.bottomLeftUl = $(elem).find('.multiSelectPanel-left-panel-ul');
        this.bottomRightUl = $(elem).find('.multiSelectPanel-right-panel-ul');
        this.bottomLeftPanel = this.$obj.find('.multiSelectPanel-left-bottom');
        this.bottomRightPanel = this.$obj.find('.multiSelectPanel-right-bottom');
        this.rightPanelUl = this.$obj.find('.multiSelectPanel-right-panel-ul');
        this.leftPanelUl = this.$obj.find('.multiSelectPanel-left-panel-ul');
        this.leftTitle = this.$obj.find('.multiSelectPanel-left-title');
        this.leftBottomTitle = this.$obj.find('.multiSelectPanel-left-bottom-title');

        renderNum(this.bottomLeftPanel, this.bottomLeftUl);
        renderNum(this.bottomRightPanel, this.bottomRightUl);
        renderTitle(this);
        bindEvents(this, elem);
        showBtn(this, elem);
        searchItem(elem);
    };
    MultiSelectPanel.prototype.show = function () {

        var elem = this.$element[0];
        $(elem).find('.multiSelectPanel').show();
    };
    MultiSelectPanel.prototype.hide = function () {

        var elem = this.$element[0];
        $(elem).find('.multiSelectPanel').hide();
    };
    MultiSelectPanel.prototype.toggle = function () {

        var elem = this.$element[0];
        $(elem).find('.multiSelectPanel').toggle();
    };
    MultiSelectPanel.prototype.addItems = function () {
        var data = [];
        var me = this;
        this.rightPanelUl.find('li').each(function () {
            data.push($(this).attr('data-id') + '=' + me.options.ucid);
        });
        return data.join(',');
    };
    // 在插件中使用multiSelectPanel对象
    $.fn.multiSelectPanel = function (options) {
        // 创建multiSelectPanel的实体
        var multiSelectPanel = new MultiSelectPanel(this, options);
        // 调用其方法
        multiSelectPanel.init(this);
        return multiSelectPanel;
    };
})(jQuery);