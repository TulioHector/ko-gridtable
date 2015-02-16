/*
 * Fraework Knockout 3.2.0 and Jquery 2.1.1 for build grid table with bootstrap 3.2.0 and fontawesome 4.2
 * Autor: Hector Romano
 * Date: 27/09/2014
 * Twitter: @RomanoTulioHec
 * Web Page: http://www.tulio-wiki.com.ar
 * GitHub: https://github.com/TulioHector/ko-gridtable
 * Licence: GPL 3.0
 * Version: 0.0.13
 */
'use strict';
var BaseViewModel = (function () {
    function BaseViewModel(params) {
        this.selectedItem = ko.observable("");
        this.rowItem = {};
        this.collectionItems = ko.observableArray([]);
        this.selectedChoice = ko.observable("");
        this.classTable = "";
        this.idGrid = params.Id;
    }
    BaseViewModel.prototype.templateToUse = function (item) {
        var tmpl = this.selectedItem() === item ? this.idGrid + '_EditTmpl' : this.idGrid + '_ItemsTmpl';
        return tmpl;
    };
    BaseViewModel.prototype.templateHeader = function () {
        return this.idGrid + "_HeaderTmpl";
    };
    BaseViewModel.prototype.templateFoot = function () {
        return this.idGrid + "_PagingTmpl";
    };
    BaseViewModel.prototype.edit = function (item) {
        this.selectedItem(item);
    };
    BaseViewModel.prototype.cancel = function () {
        this.selectedItem(null);
    };
    BaseViewModel.prototype.add = function () {
        var newItem = this.rowItem;
        this.collectionItems.push(newItem);
        this.selectedItem(newItem);
    };
    BaseViewModel.prototype.remove = function (itemToDelete) {
        this.removeItem(itemToDelete);
    };
    BaseViewModel.prototype.removeItem = function (itemToDelete) {
        var obj = new CallMethod();
        obj.call({
            Url: this.deleteUrl,
            Type: 'DELETE',
            Param: JSON.stringify(itemToDelete)
        });
        obj.result.done(function (data) {
            if (data.Type === "error") {
                //commit(false);
                this.DisplayAlert(data.msj, "danger");
            }
            else {
                //commit(true);
                this.load();
            }
        });
    };
    return BaseViewModel;
})();
;
/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/knockout/knockout.d.ts" />
/// <reference path="../typings/knockout.viewmodel/knockout.viewmodel.d.ts" />
/// <reference path="Interfaces.ts"/>
/// <reference path="BaseViewModel.ts"/>
/*
Fraework Knockout 3.2.0 and Jquery 2.1.1 for build grid table with bootstrap 3.2.0 and fontawesome 4.2
Autor: Hector Romano
Date: 27/09/2014
Twitter: @RomanoTulioHec
Web Page: http://hromano.net
GitHub: https://github.com/TulioHector/ko-gridtable
Licence: GPL 3.0
Version: 0.0.14
*/
'use strict';
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var KoGridTable = (function (_super) {
    __extends(KoGridTable, _super);
    function KoGridTable(params) {
        var _this = this;
        _super.call(this, params);
        this.defaultPageSize = 0;
        this.cmbModel = {};
        this.combosSources = [];
        this.selectedChoicePaging = ko.observable("");
        this.pageSize = ko.observable(10);
        this.currentPageIndex = ko.observable(0);
        this.totalPages = ko.observable(0);
        this.sortType = "asc";
        this.currentColumn = ko.observable("");
        this.iconType = ko.observable("");
        this.totalRows = ko.observable(0);
        this.currentSelected = ko.observable();
        this.currentPage = ko.computed(function () {
            return _this.collectionItems();
        });
        this.url = params.Url || "";
        this.editUrl = params.UrlEdit || "";
        this.addUrl = params.UrlAddItem || "";
        this.deleteUrl = params.UrlDeleteItem || "";
        this.columns = params.Columns || [];
        this.enableEditInline = params.EnableEditInline || false;
        this.idGrid = params.Id || null;
        this.pagings = params.Pagings || null;
        this.defaultPageSize = params.DefaultPageSize || 5;
        this.callBackError = params.CallbackError || null;
        this.classTable = params.ClassTable || "table table-hover table-condensed";
        this.buidItemModel();
        this.buildTemplate();
        this.load();
        this.templateHeader = this.templateHeader.bind(this);
        this.templateToUse = this.templateToUse.bind(this);
        this.templateFoot = this.templateFoot.bind(this);
        this.edit = this.edit.bind(this);
        this.cancel = this.cancel.bind(this);
        this.save = this.save.bind(this);
        this.remove = this.remove.bind(this);
    }
    KoGridTable.prototype.save = function (row) {
        var _this = this;
        var rowdata = this.selectedItem();
        var isAddRow = (typeof (rowdata.Id) === "function");
        var idSelected = this.selectedChoice();
        var obj = new CallMethod();
        $.each(this.columns, function (key, value) {
            if (value.Type === 'select') {
                var val = row[value.Name];
                var cmbObj = {};
                cmbObj[value.DataValue] = idSelected;
                cmbObj[value.DataText] = "";
                if (typeof val === 'function') {
                    row[value.Name](cmbObj);
                }
                else {
                    row[value.Name] = cmbObj;
                }
            }
        });
        if (isAddRow) {
            var props = Object.getOwnPropertyNames(row);
            var dataObj = {};
            for (var key in props) {
                dataObj[props[key]] = row[props[key]]();
            }
            obj.call({
                Url: this.addUrl,
                Type: 'POST',
                Param: JSON.stringify(dataObj)
            });
            obj.result.done(function (data) {
                if (data.Type === "error") {
                    //commit(false);
                    if (typeof _this.callBackError === 'function') {
                        _this.callBackError(data.Message, "danger");
                    }
                }
                else {
                    //commit(true);                    
                    _this.load();
                }
            });
        }
        else {
            obj.call({
                Url: this.editUrl,
                Type: 'PUT',
                Param: JSON.stringify(row)
            });
            obj.result.done(function (data) {
                if (data.Type === "error") {
                    //commit(false);
                    if (typeof _this.callBackError === 'function') {
                        _this.callBackError(data.Message, "danger");
                    }
                }
                else {
                    //commit(true);
                    _this.load();
                }
            });
        }
        this.selectedItem(null);
    };
    KoGridTable.prototype.buildTemplate = function () {
        var _this = this;
        // row template
        var scriptRow = document.createElement("script");
        scriptRow.setAttribute('id', this.idGrid + '_ItemsTmpl');
        scriptRow.setAttribute('type', 'text/html');
        var htmlRow = "<tr>";
        $.each(this.columns, function (key, value) {
            var colHidden = typeof value.Hidden === 'undefined' ? false : true;
            var isCustomCol = typeof value.CustomColumn === 'undefined' ? false : true;
            var enableAbn = typeof value.EnableAbm === 'undefined' ? false : true;
            var existContent = typeof value.Content === 'undefined' ? false : true;
            if (isCustomCol) {
                if (enableAbn && value.CustomColumn) {
                    var htd = "<td class=\"buttons\">";
                    if (value.EnableAbm) {
                        var btnEdit = "<button data-bind=\"click: $parent.edit\"><span class=\"fa fa-floppy-o\"></span></button>";
                        var btnRemove = "<button data-bind=\"click: $parent.remove\"><span class=\"fa fa-trash\"></span></button>";
                        htd += _this.enableEditInline ? btnEdit + btnRemove : btnRemove;
                    }
                    htd += existContent ? value.Content : "";
                    htd += "</td>";
                    htmlRow += htd;
                }
            }
            else {
                switch (value.Type) {
                    case "checkbox":
                        htmlRow += "<td data-bind=\"visible: $parent.isVisible(" + !colHidden + ")\"><input class=\"checkbox input-sm\" data-bind=\"setCheckboxValue: { text: " + value.Name + " }\" type=\"" + value.Type + "\" disabled /></td>";
                        break;
                    default:
                        htmlRow += "<td data-bind=\"text: " + value.Name + ", visible: $parent.isVisible(" + !colHidden + ")\"></td>";
                        break;
                }
            }
        });
        htmlRow += "</tr>";
        scriptRow.innerHTML = htmlRow;
        document.head.appendChild(scriptRow);
        // edit row template
        if (this.enableEditInline) {
            var scriptEdit = document.createElement("script");
            scriptEdit.setAttribute('id', this.idGrid + '_EditTmpl');
            scriptEdit.setAttribute('type', 'text/html');
            var htmlEdit = "<tr>";
            $.each(this.columns, function (key, value) {
                var colHidden = typeof value.Hidden === 'undefined' ? false : true;
                var isCustomCol = typeof value.CustomColumn === 'undefined' ? false : true;
                if (isCustomCol) {
                    htmlEdit += '<td class="buttons"><button data-bind="click: $parent.save"><span class="fa fa-floppy-o"></span></button><button data-bind="click: $parent.cancel"><span class="fa fa-times"></span></button></td>';
                }
                else {
                    if (!colHidden) {
                        htmlEdit += '<td>';
                        switch (value.Type) {
                            case "select":
                                var databind = 'options: $parent.getCombosSources(\'' + value.Name + '\'), optionsText: \'' + value.DataText + '\', optionsValue: \'' + value.DataValue + '\', value: $parent.selectedChoice , optionsCaption: \'' + value.OptionsCaption + '\' ';
                                htmlEdit += "<select class=\"cmb_" + value.Name + " form-control input-sm\" data-bind=\"" + databind + "\"></select></td>";
                                break;
                            case "checkbox":
                                htmlEdit += "<input class=\"checkbox input-sm\" data-bind=\"checked: " + value.Name + ", $parent.setCheckboxValue: { text: " + value.Name + " },uniqueName: true\" type=\"" + value.Type + "\"/></td>";
                            default:
                                htmlEdit += "<input class=\"form-control input-sm\" data-bind=\"value: " + value.Name + ", uniqueName: true\" type=\"" + value.Type + "\"/></td>";
                                break;
                        }
                    }
                }
            });
            htmlEdit += "</tr>";
            scriptEdit.innerHTML = htmlEdit;
            document.head.appendChild(scriptEdit);
        }
        // header template
        var scriptHeader = document.createElement("script");
        scriptHeader.setAttribute('id', this.idGrid + "_HeaderTmpl");
        scriptHeader.setAttribute('type', 'text/html');
        var htmlHeader = "<tr data-bind=\"click: sortTable\">";
        $.each(this.columns, function (key, value) {
            var colHidden = typeof value.Hidden === 'undefined' ? false : true;
            var isCustomCol = typeof value.CustomColumn === 'undefined' ? false : true;
            if (isCustomCol) {
                var c = "<th>" + value.Name + "</th>";
                htmlHeader += value.CustomColumn ? c : "";
            }
            else {
                htmlHeader += "<th data-column=\"" + value.Name + "\" data-bind=\"" + " visible: isVisible(" + !colHidden + ")\">" + value.Name + "";
                htmlHeader += "<span >";
                htmlHeader += "<i data-bind=\"attr: { class: iconType } \"></i>";
                htmlHeader += "</span></th>";
            }
        });
        htmlHeader += '</tr>';
        scriptHeader.innerHTML = htmlHeader;
        document.head.appendChild(scriptHeader);
        //paging template
        if (this.pagings !== null) {
            var scriptPaging = document.createElement("script");
            scriptPaging.setAttribute('id', this.idGrid + "_PagingTmpl");
            scriptPaging.setAttribute('type', 'text/html');
            var htmlPaging = "<tr>";
            htmlPaging += "<td>" + this.pagings.SelectorName;
            htmlPaging += "<select id=\"pageSizeSelector\" data-bind=\"value: selectedChoicePaging\">";
            var parseRange = this.pagings.SelectorRang.split('-');
            var acum = 0;
            for (var i = 0; i < parseInt(parseRange[0]); i++) {
                var num = parseInt(parseRange[1]);
                var num2 = (num + acum);
                htmlPaging += "<option value=\"" + (num2) + "\">" + (num2) + "</option>";
                acum = num2;
            }
            htmlPaging += "</select></td>";
            htmlPaging += "<td colspan=\"6\">";
            htmlPaging += "<button data-bind=\"click: previousPage\" class=\"btn\"><i class=\"fa fa-angle-double-left\"></i></button>";
            htmlPaging += this.pagings.NamePages + "<label data-bind=\"text: currentPageIndex() + 1\" class=\"badge\"></label>";
            htmlPaging += this.pagings.NameTotalPages + "<label data-bind=\"text: totalPages() + 1\" class=\"badge\"></label>";
            htmlPaging += "<button data-bind=\"click: nextPage\" class=\"btn\"><i class=\"fa fa-angle-double-right\"></i></button>";
            htmlPaging += this.pagings.NameTotalCount + "<label data-bind=\"text: totalRows() \" class=\"badge\"></label>";
            htmlPaging += "</td></tr>";
            scriptPaging.innerHTML = htmlPaging;
            document.head.appendChild(scriptPaging);
        }
        // alerts
        var clearDiv = document.createElement("div");
        clearDiv.setAttribute('class', 'clearfix');
        var scriptAlert = document.createElement("div");
        scriptAlert.setAttribute('id', this.idGrid + '_alertKoGridTable');
        scriptAlert.setAttribute('class', 'alert');
        scriptAlert.setAttribute('role', 'alert');
        scriptAlert.style.display = "none";
        var grid = document.getElementById(this.idGrid);
        grid.parentNode.appendChild(clearDiv);
        grid.parentNode.appendChild(scriptAlert);
    };
    KoGridTable.prototype.isVisible = function (hidden) {
        return hidden;
    };
    KoGridTable.prototype.nextPage = function () {
        var totalCount = this.totalRows();
        if (((this.currentPageIndex() + 1) * this.pageSize()) < totalCount) {
            this.currentPageIndex(this.currentPageIndex() + 1);
        }
        else {
            this.currentPageIndex(0);
        }
        this.load();
    };
    KoGridTable.prototype.previousPage = function () {
        var totalCount = this.totalRows();
        if (this.currentPageIndex() > 0) {
            this.currentPageIndex(this.currentPageIndex() - 1);
        }
        else {
            this.currentPageIndex((Math.ceil(totalCount / this.pageSize())) - 1);
        }
        this.load();
    };
    KoGridTable.prototype.sortTable = function (viewModel, e) {
        var orderProp = $(e.target).attr("data-column");
        this.currentColumn(orderProp);
        this.load();
        this.sortType = (this.sortType === "asc") ? "desc" : "asc";
        this.iconType((this.sortType === "asc") ? "fa fa-sort-alpha-asc" : "fa fa-sort-numeric-desc");
    };
    KoGridTable.prototype.getCombosSources = function (dataSource) {
        return this.combosSources[dataSource];
    };
    KoGridTable.prototype.getDataSourece = function (url, method, model) {
        var _this = this;
        var ajax = new CallMethod();
        ajax.call({
            Url: url,
            Type: method,
            dataType: "json",
        });
        ajax.result.done(function (data) {
            var array = [];
            $.each(data, function (index, value) {
                var m = {};
                m[model.DataText] = ko.observable(value[model.DataText]);
                m[model.DataValue] = ko.observable(value[model.DataValue]);
                array.push(m);
            });
            _this.combosSources[model.Name] = array;
        });
    };
    KoGridTable.prototype.buidItemModel = function () {
        var _this = this;
        $.each(this.columns, function (key, value) {
            //var name = value.Name;
            var type = value.Type;
            switch (type) {
                case "select":
                    _this.cmbModel[value.DataText] = ko.observable(value.DataText);
                    _this.cmbModel[value.DataValue] = ko.observable(value.DataValue);
                    _this.getDataSourece(value.DataSourceUrl, "get", value);
                    _this.rowItem[value.Name] = ko.observable(value.Name);
                    break;
                default:
                    _this.rowItem[value.Name] = ko.observable(value.Name);
                    break;
            }
        });
    };
    KoGridTable.prototype.load = function () {
        var _this = this;
        var ajax = new CallMethod();
        var order = this.currentColumn();
        var data = {
            Orderby: order !== "" ? encodeURIComponent(this.currentColumn() + ' ' + this.sortType) : null,
            Top: this.pageSize(),
            Skip: this.currentPageIndex() * this.pageSize(),
            PageIndex: this.currentPageIndex(),
            PageSize: this.pageSize()
        };
        ajax.call({
            Url: this.url,
            Type: "GET",
            dataType: "json",
            Param: data
        });
        ajax.result.done(function (result) {
            var dataRows = result.Rows;
            _this.totalRows(result.TotalRows);
            _this.collectionItems(dataRows);
            var calcTotalPage = Math.ceil((result.TotalRows / _this.pageSize())) - 1;
            _this.totalPages(calcTotalPage);
        });
    };
    return KoGridTable;
})(BaseViewModel);
// register web componet
ko.components.register('ko-gridtable', {
    viewModel: {
        createViewModel: function (params, componentInfo) {
            var g = new KoGridTable(params);
            return g;
        }
    },
    template: '<table data-bind="css: classTable" >' + '<thead data-bind="template: {name: templateHeader} ">' + '</thead>' + '<tbody data-bind="template: { name: templateToUse, foreach: currentPage}"></tbody>' + '<tfoot data-bind="template: {name: templateFoot} ">' + '</tfoot>' + '</table>' + '<div class="pull-left">' + '<button data-bind="click: add" type="button" class="btn btn-default addrow">' + '<span class="fa fa-plus-square"></span>' + '</button>' + '</div>'
});
ko.applyBindings();
function stringToBoolean(string) {
    var isBoolean = typeof string == 'boolean';
    if (isBoolean) {
        return string;
    }
    if (typeof string === 'function') {
        return false;
    }
    switch (string.toLowerCase()) {
        case "true":
        case "yes":
        case "1":
            return true;
        case "false":
        case "no":
        case "0":
        case null:
            return false;
        default:
            return Boolean(string);
    }
}
ko.bindingHandlers.setCheckboxValue = {
    update: function (element, valueAccessor) {
        var value;
        var el = $(element);
        value = ko.utils.unwrapObservable(valueAccessor());
        if (stringToBoolean(value.text)) {
            el.prop('checked', true);
        }
        else {
            el.prop('checked', false);
        }
    }
};
var CallMethod = (function () {
    function CallMethod() {
        this.me = this;
    }
    CallMethod.prototype.call = function (opt) {
        opt = opt || {};
        var vUrl = opt.Url || "";
        var vParam = opt.Param || {};
        var vDataType = opt.dataType || 'json';
        var vType = opt.Type || "POST";
        var vAsync = opt.Async || true;
        var ajax = $.ajax({
            type: vType,
            dataType: vDataType,
            contentType: 'application/json; charset=utf-8',
            data: vParam,
            url: vUrl,
            async: vAsync,
            //traditional: true,
            //processData: false,
            cache: false
        });
        this.result = ajax;
    };
    return CallMethod;
})();
//# sourceMappingURL=koGridTable-all.js.map