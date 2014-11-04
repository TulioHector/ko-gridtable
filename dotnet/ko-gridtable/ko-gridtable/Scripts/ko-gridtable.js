/* 
 * Fraework Knockout 3.2.0 and Jquery 2.1.1 for build grid table with bootstrap 3.2.0 and fontawesome 4.2
 * Autor: Hector Romano
 * Date: 27/09/2014
 * Twitter: @RomanoTulioHec
 * Web Page: http://www.tulio-wiki.com.ar
 * GitHub: https://github.com/TulioHector/ko-gridtable
 * Licence: GPL 3.0
 * Version: 0.0.12
 */
;
'use strict';

var KoGridTable = function (options) {
    $this = this;
    var opt = options || {};
    $this.url = opt.Url || "";
    $this.customHandler = opt.CustomHandler || null;
    $this.hiddenColumn = opt.HiddenColumn || [];
    $this.editUrl = opt.UrlEdit || "";
    $this.addUrl = opt.UrlAddItem || "";
    $this.deleteUrl = opt.UrlDeleteItem || "";
    $this.columns = opt.columns || [];
    $this.enableEditInline = opt.EnableEditInline || false;
    $this.idGrid = opt.Id || null;
    $this.pagings = opt.Pagings || null;
    $this.stringifySendData = opt.StringifySendData || false;

    $this.RowItem = {};
    $this.CmbModel = {};

    $this.columns = [];
    $this.combosSources = [];
    $this.selectedChoice = ko.observable();
    $this.selectedChoicePaging = ko.observable();
    $this.selectedItem = ko.observable();
    $this.currentPage = ko.observable();
    $this.pageSize = ko.observable(10);
    $this.currentPageIndex = ko.observable(0);
    $this.contacts = ko.observableArray([]);
    $this.totalPages = ko.observable();
    $this.sortType = "asc";
    $this.currentColumn = ko.observable("");
    $this.iconType = ko.observable("");
    $this.totalRows = ko.observable(0);
    $this.CurrentSelected = ko.observable();
    $this.modalDialegId = "modelKoGrid";

    $this.edit = function (item) {
        $this.selectedItem(item);
    };
    $this.cancel = function () {
        $this.selectedItem(null);
    };
    $this.add = function () {
        var newItem = $this.RowItem;
        $this.contacts.push(newItem);
        $this.selectedItem(newItem);
    };
    $this.remove = function (itemToDelete) {
        $this.RemoveItem(itemToDelete);
    };
    $this.RemoveItem = function (itemToDelete) {
        var obj = new callMethod();
        obj.call({
            Url: $this.deleteUrl,
            Type: 'DELETE',
            Param: JSON.stringify(itemToDelete)
        });
        obj.result.done(function (data) {
            if (data.Type === "error") {
                //commit(false);
                $this.DisplayAlert(data.msj, "danger");
            } else {
                //commit(true);
                $this.load();
            }
        });
    };
    /*
    $this.selectedChoicePaging.subscribe(function (newValue) {
        $this.pageSize(newValue);
        $this.load();
    });
    */
    $this.DisplayAlert = function (msg, type) {
        var alert = document.getElementById("alertKoGridTable");

        switch (type) {
            case "success":
                alert.className = alert.className + " alert-success";
                break;
            case "info":
                alert.className = alert.className + " alert-info";
                break;
            case "warning":
                alert.className = alert.className + " alert-warning";
                break;
            case "danger":
                alert.className = alert.className + " alert-danger";
                break;
        }
        alert.innerHTML = msg;
        alert.style.display = "block";
    };

    $this.GetDataToSend = function (objToSend) {
        if ($this.stringifySendData) {
            return JSON.stringify(objToSend);
        } else {
            return objToSend;
        }
    };

    $this.save = function (row) {
        var rowdata = $this.selectedItem();
        var isAddRow = (typeof (rowdata.Id) === "function");
        var idSelected = $this.selectedChoice();
        var obj = new callMethod();
        
        $.each($this.columns, function (key, value) {
            if (value.Type === 'select') {
                var val = row[value.Name];
                var cmbObj = {};
                cmbObj[value.DataValue] = idSelected;
                cmbObj[value.DataText] = "";
                if (typeof val === 'function') {
                    row[value.Name](cmbObj);
                } else {
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
                Url: $this.addUrl,
                Type: 'POST',
                Param: JSON.stringify(dataObj)
            });
            obj.result.done(function (data) {
                if (data.Type === "error") {
                    //commit(false);
                    $this.DisplayAlert(data.Message, "danger");
                } else {
                    //commit(true);                    
                    $this.load();
                }
            });
        } else {
            obj.call({
                Url: $this.editUrl,
                Type: 'PUT',
                Param: JSON.stringify(row)
            });
            obj.result.done(function (data) {
                if (data.Type === "error") {
                    //commit(false);
                    $this.DisplayAlert(data.Message, "danger");
                } else {
                    //commit(true);
                    $this.load();
                }
            });
        }
        
        $this.selectedItem(null);
    };
    $this.templateToUse = function (item) {
        var tmpl = $this.selectedItem() === item ? $this.idGrid+'_EditTmpl' : $this.idGrid+'_ItemsTmpl';
        return tmpl;
    };
    $this.templateHeader = function () {
        return $this.idGrid+"_HeaderTmpl";
    }
    $this.templateFoot = function () {
        return $this.idGrid+"_PagingTmpl";
    }
    $this.buildTemplate = function () {
        // row template
        var scriptRow = document.createElement("script");
        scriptRow.setAttribute('id', $this.idGrid + '_ItemsTmpl');
        scriptRow.setAttribute('type', 'text/html');
        var htmlRow = "<tr>";
        $.each($this.columns, function (key, value) {
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
                        htd += $this.enableEditInline ? btnEdit + btnRemove : btnRemove;
                    }
                    htd += existContent ? value.Content : "";
                    htd += "</td>";
                    htmlRow += htd;
                }
            } else {
                switch (value.Type) {
                    case "checkbox":
                        htmlRow += "<td data-bind=\"visible: $parent.IsVisible(" + !colHidden + ")\"><input class=\"checkbox input-sm\" data-bind=\"setCheckboxValue: { text: " + value.Name + " }\" type=\"" + value.Type + "\" disabled /></td>";
                        break;
                    default:
                        htmlRow += "<td data-bind=\"text: " + value.Name + ", visible: $parent.IsVisible(" + !colHidden + ")\"></td>";
                        break;
                }
            }
        });

        htmlRow += "</tr>";
        var rowBody = scriptRow.innerHTML = htmlRow;
        document.head.appendChild(scriptRow);

        // edit row template
        if ($this.enableEditInline) {
            var scriptEdit = document.createElement("script");
            scriptEdit.setAttribute('id', $this.idGrid + '_EditTmpl');
            scriptEdit.setAttribute('type', 'text/html');
            var htmlEdit = "<tr>";
            $.each($this.columns, function (key, value) {
                var colHidden = typeof value.Hidden === 'undefined' ? false : true;
                var isCustomCol = typeof value.CustomColumn === 'undefined' ? false : true;
                if (isCustomCol) {
                    htmlEdit += '<td class="buttons"><button data-bind="click: $parent.save"><span class="fa fa-floppy-o"></span></button><button data-bind="click: $parent.cancel"><span class="fa fa-times"></span></button></td>';
                } else {
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
            var editBody = scriptEdit.innerHTML = htmlEdit;
            document.head.appendChild(scriptEdit);
        }
        // header template
        var scriptHeader = document.createElement("script");
        scriptHeader.setAttribute('id', $this.idGrid + "_HeaderTmpl");
        scriptHeader.setAttribute('type', 'text/html');
        var htmlHeader = "<tr data-bind=\"click: sortTable\">";
        $.each($this.columns, function (key, value) {
            var colHidden = typeof value.Hidden === 'undefined' ? false : true;
            var isCustomCol = typeof value.CustomColumn === 'undefined' ? false : true;

            if (isCustomCol) {
                var c = "<th>" + value.Name + "</th>";
                htmlHeader += value.CustomColumn ? c : "";
            } else {
                htmlHeader += "<th data-column=\"" + value.Name + "\" data-bind=\"" + " visible: IsVisible(" + !colHidden + ")\">" + value.Name + "";
                htmlHeader += "<span >";
                htmlHeader += "<i data-bind=\"attr: { class: iconType } \"></i>";
                htmlHeader += "</span></th>";
            }
        });
        htmlHeader += '</tr>';
        scriptHeader.innerHTML = htmlHeader;
        document.head.appendChild(scriptHeader);

        //paging template
        if ($this.pagings !== null) {
            var scriptPaging = document.createElement("script");
            scriptPaging.setAttribute('id', $this.idGrid + "_PagingTmpl");
            scriptPaging.setAttribute('type', 'text/html');
            var htmlPaging = "<tr>";
            htmlPaging += "<td>" + $this.pagings.SelectorName;
            htmlPaging += "<select id=\"pageSizeSelector\" data-bind=\"value: selectedChoicePaging\">";
            var parseRange = $this.pagings.SelectorRang.split('-');
            var acum = 0;
            for (var i = 0; i < parseRange[0]; i++) {
                var num = parseInt(parseRange[1]);
                var num2 = (num + acum);
                htmlPaging += "<option value=\"" + (num2) + "\">" + (num2) + "</option>";
                acum = num2;
            }

            htmlPaging += "</select></td>";
            htmlPaging += "<td colspan=\"6\">";
            htmlPaging += "<button data-bind=\"click: previousPage\" class=\"btn\"><i class=\"fa fa-angle-double-left\"></i></button>";
            htmlPaging += $this.pagings.NamePages + "<label data-bind=\"text: currentPageIndex() + 1\" class=\"badge\"></label>";
            htmlPaging += $this.pagings.NameTotalPages + "<label data-bind=\"text: totalPages() + 1\" class=\"badge\"></label>";
            htmlPaging += "<button data-bind=\"click: nextPage\" class=\"btn\"><i class=\"fa fa-angle-double-right\"></i></button>";
            htmlPaging += $this.pagings.NameTotalCount + "<label data-bind=\"text: totalRows() \" class=\"badge\"></label>";
            htmlPaging += "</td></tr>";
            scriptPaging.innerHTML = htmlPaging;
            document.head.appendChild(scriptPaging);
        }
        // alerts
        var clearDiv = document.createElement("div");
        clearDiv.setAttribute('class', 'clearfix');
        var scriptAlert = document.createElement("div");
        scriptAlert.setAttribute('id', $this.idGrid + '_alertKoGridTable');
        scriptAlert.setAttribute('class', 'alert');
        scriptAlert.setAttribute('role', 'alert');
        scriptAlert.style.display = "none";
        var grid = document.getElementById($this.idGrid);
        grid.parentNode.appendChild(clearDiv);
        grid.parentNode.appendChild(scriptAlert);
    };

    $this.IsVisible = function (hidden) {
        return hidden;
    };

    $this.IsHiddenColumn = function () {
        $.each($this.hiddenColumn, function (key, value) {
            $.each($this.columns, function (keyc, valuec) {
                var target = $(valuec);
                var columnName = target.attr("data-column");
                if (value === columnName) {
                    var index = target.index() + 1;
                    $("td:nth-child(" + index + "),th:nth-child(" + index + ")").hide();
                }
            });
        });
    };

    $this.currentPage = ko.computed(function () {
        return $this.contacts();
    });
    $this.nextPage = function () {
        
        var totalCount = parseInt($this.totalRows());
        if ((($this.currentPageIndex() + 1) * $this.pageSize()) < totalCount) {
            $this.currentPageIndex($this.currentPageIndex() + 1);
        }
        else {
            $this.currentPageIndex(0);
        }
        $this.load();
    };
    $this.previousPage = function () {
        var totalCount = parseInt($this.totalRows());
        if ($this.currentPageIndex() > 0) {
            $this.currentPageIndex($this.currentPageIndex() - 1);
        }
        else {
            $this.currentPageIndex((Math.ceil(totalCount / $this.pageSize())) - 1);
        }
        $this.load();
    };
    $this.sortTable = function (viewModel, e) {
        var orderProp = $(e.target).attr("data-column");
        $this.currentColumn(orderProp);
        $this.load();
        $this.sortType = ($this.sortType === "asc") ? "desc" : "asc";
        $this.iconType(($this.sortType === "asc") ? "fa fa-sort-alpha-asc" : "fa fa-sort-numeric-desc");
    };

    $this.filterTable = function () {

    };

    $this.getCombosSources = function (dataSource) {
        return $this.combosSources[dataSource];
    };

    $this.GetDataSourece = function (url, method, model) {
        $.ajax({
            url: url,
            type: method,
            contentType: "application/json",
            async: false,
            success: function (data) {
                var array = [];
                $.each(data, function (index, value) {
                    var m = {};
                    m[model.DataText] = ko.observable(value[model.DataText]);
                    m[model.DataValue] = ko.observable(value[model.DataValue]);
                    array.push(m);
                });

                $this.combosSources[model.Name] = array;
            }
        });
    };

    $this.buidItemModel = function () {
        $.each($this.columns, function (key, value) {
            var name = value.Name;
            var type = value.Type;
            switch (type) {
                case "select":
                    $this.CmbModel[value.DataText] = ko.observable(value.DataText);
                    $this.CmbModel[value.DataValue] = ko.observable(value.DataValue);
                    $this.GetDataSourece(value.DataSourceUrl, "get", value);
                    $this.RowItem[value.Name] = ko.observable(value.Name);
                    break;
                default:
                    $this.RowItem[value.Name] = ko.observable(value.Name);
                    break;
            }

        });
    };

    $this.load = function () {
        
        var order = $this.currentColumn();
        var data = {
            Orderby: order !== "" ? escape($this.currentColumn() + ' ' + $this.sortType) : null,
            Top: $this.pageSize(),
            Skip: $this.currentPageIndex() * $this.pageSize(),
            PageIndex: $this.currentPageIndex(),
            PageSize: $this.pageSize()
        };
        $.ajax({
            url: $this.url,
            type: "GET",
            dataType: "json",
            data: data
        }).done(function (result) {
            var data = result;
            var dataRows = data.Rows;
            
            $this.totalRows(data.TotalRows);
            $this.contacts(dataRows);

            var calcTotalPage = Math.ceil((data.TotalRows / $this.pageSize())) - 1;
            $this.totalPages(calcTotalPage);
        });
    };
    
    $this.buidItemModel();
    $this.buildTemplate();
    $this.load();
};
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
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var el = $(element);
        var value = ko.utils.unwrapObservable(valueAccessor());
        
        if (stringToBoolean(value.text)) {
            el.prop('checked', true);
        } else {
            el.prop('checked', false);
        }
    }
};
function callMethod() {
    var me = this;
    var result;

    this.call = function (opt) {
        var opt = opt || {};
        vUrl = opt.Url || "";
        vParam = opt.Param || {};
        vDataType = opt.dataType || 'json';
        vType = opt.Type || "POST";
        vAsync = opt.Async || true;

        var _ajax = $.ajax({
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

        me.result = _ajax;
    };
}
// register web componet
/*
ko.components.register('ko-gridtable', {
    viewModel: {
        createViewModel: function (params, componentInfo) {
            var g = new KoGridTable(params);
            return g;
        }
    },
    template: '<table class="table table-hover table-condensed" id="gridSample" >' +
                '<thead data-bind="template: {name: templateHeader} ">' +
                '</thead>' +
                '<tbody data-bind="template: { name: templateToUse, foreach: currentPage}"></tbody>' +
                '<tfoot data-bind="template: {name: templateFoot} ">' +
                '</tfoot>' +
            '</table>' +
            '<div class="pull-left">' +
                '<button data-bind="click: add" type="button" class="btn btn-default addrow">' +
                    '<span class="fa fa-plus-square"></span>' +
                '</button>' +
            '</div>'
});
ko.applyBindings();
*/
;