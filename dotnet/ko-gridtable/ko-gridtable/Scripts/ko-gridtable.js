/* 
 * Fraework Knockout 3.2.0 and Jquery 2.1.1 for build grid table with bootstrap 3.2.0 and fontawesome 4.2
 * Autor: Hector Romano
 * Date: 27/09/2014
 * Twitter: @RomanoTulioHec
 * Web Page: http://www.tulio-wiki.com.ar
 * GitHub: https://github.com/TulioHector/ko-gridtable
 * Licence: GPL 3.0
 * Version: 0.0.9
 */
;
'use strict';

var koGridTable = function (options) {
    $this = this;
    var opt = options || {};
    $this.url = opt.Url || "";
    $this.customHandler = opt.CustomHandler || null;
    $this.hiddenColumn = opt.HiddenColumn || [];
    $this.editUrl = opt.UrlEdit || "";
    $this.addUrl = opt.UrlAddItem || "";
    $this.deleteUrl = opt.UrlDeleteItem || "";
    $this.columns = opt.Columns || [];
    $this.enableEditInline = opt.EnableEditInline || false;
    $this.idGrid = opt.Id || null;
    $this.pagings = opt.Pagings || null;
    $this.stringifySendData = opt.StringifySendData || false;

    $this.RowItem = {};
    $this.CmbModel = {};

    $this.Columns = [];
    $this.cmbRol = ko.observableArray([]);
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
            if (data.type === "error") {
                //commit(false);
                $this.DisplayAlert(data.msj, "danger");
            } else {
                //commit(true);
                $this.load();
            }
        });
    };
    $this.ModalDialog = function (text, title) {
        var model;
        if (document.getElementById($this.modalDialegId)) {
            model = document.getElementById($this.modalDialegId);
        } else {
            model = document.createElement("div");
        }

        model.setAttribute('id', $this.modalDialegId);
        model.setAttribute('class', "modal fade");
        var html = "<div class=\"modal-dialog\">";
        html += "<div class=\"modal-content\">";
        html += "<div class=\"modal-header\">";
        html += "<button type=\"button\" class=\"close\" data-dismiss=\"modal\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
        html += "<h4 class=\"modal-title\">" + title + "</h4>";
        html += "</div>";
        html += "<div class=\"modal-body\">";
        html += "<p>" + text + "</p>";
        html += "</div>";
        html += "<div class=\"modal-footer\">";
        html += "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Close</button>";
        html += "<button type=\"button\" data-bind=\"click: $root.RemoveItem\" class=\"btn btn-primary\">Save changes</button>";
        html += "</div>";
        html += "</div><!-- /.modal-content -->";
        html += "</div><!-- /.modal-dialog -->";
        model.innerHTML = html;
        document.body.appendChild(model);
    };

    $this.selectedChoicePaging.subscribe(function (newValue) {
        $this.pageSize(newValue);
        $this.load();
    });

    $this.GetTextValueCmb = function (cmbItems, idValue) {
        var _cmbItems = cmbItems();
        var _value = idValue;
        for (var i = 0; i < _cmbItems.length; i++) {
            var item = _cmbItems[i];
            if (item.Id() === _value) {
                return item.Descripcion();
            }
        }
    };

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
        var idRolSelected = $this.selectedChoice();
        var obj = new callMethod();

        if (isAddRow) {
            var props = Object.getOwnPropertyNames(rowdata);
            var dataObj = {};

            for (var key in props) {
                dataObj[props[key]] = escape(rowdata[props[key]]());
            }

            obj.call({
                Url: $this.addUrl,
                Type: 'POST',
                Param: JSON.stringify(dataObj)
            });
            obj.result.done(function (data) {
                if (data.type === "error") {
                    //commit(false);
                    $this.DisplayAlert(data.msj, "danger");
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
                if (data.type === "error") {
                    //commit(false);
                    $this.DisplayAlert(data.msj, "danger");
                } else {
                    //commit(true);
                    $this.load();
                }
            });
        }

        $this.selectedItem(null);
    };
    $this.templateToUse = function (item) {
        var tmpl = $this.selectedItem() === item ? 'editTmpl' : 'itemsTmpl';
        return tmpl;
    };
    $this.buildTemplate = function () {
        // row template
        var scriptRow = document.createElement("script");
        scriptRow.setAttribute('id', 'itemsTmpl');
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
                        var btnEdit = "<button data-bind=\"click: $root.edit\"><span class=\"fa fa-floppy-o\"></span></button>";
                        var btnRemove = "<button data-bind=\"click: $root.remove\"><span class=\"fa fa-trash\"></span></button>";
                        htd += $this.enableEditInline ? btnEdit + btnRemove : btnRemove;
                    }
                    htd += existContent ? value.Content : "";
                    htd += "</td>";
                    htmlRow += htd;
                }
            } else {
                switch (value.Type) {
                    case "checkbox":
                        htmlRow += "<td data-bind=\"visible: \$root.IsVisible(" + !colHidden + ")\"><input class=\"checkbox input-sm\" data-bind=\"setCheckboxValue: { text: " + value.Name + " }\" type=\"" + value.Type + "\" disabled /></td>";
                        break;
                    default:
                        htmlRow += "<td data-bind=\"text: " + value.Name + ", visible: \$root.IsVisible(" + !colHidden + ")\"></td>";
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
            scriptEdit.setAttribute('id', 'editTmpl');
            scriptEdit.setAttribute('type', 'text/html');
            var htmlEdit = "<tr>";
            $.each($this.columns, function (key, value) {
                var colHidden = typeof value.Hidden === 'undefined' ? false : true;
                var isCustomCol = typeof value.CustomColumn === 'undefined' ? false : true;
                if (isCustomCol) {
                    htmlEdit += '<td class="buttons"><button data-bind="click: $root.save"><span class="fa fa-floppy-o"></span></button><button data-bind="click: $root.cancel"><span class="fa fa-times"></span></button></td>';
                } else {
                    if (!colHidden) {
                        htmlEdit += '<td>';
                        switch (value.Type) {
                            case "select":
                                var databind = 'options: $root.getCombosSources(\'' + value.Name + '\'), optionsText: \'' + value.DataText + '\', optionsValue: \'' + value.DataValue + '\', value: $root.selectedChoice , optionsCaption: \'Elegir..\' ';
                                htmlEdit += "<select class=\"cmb_" + value.Name + " form-control input-sm\" data-bind=\"" + databind + "\"></select></td>";
                                break;
                            case "checkbox":
                                htmlEdit += "<input class=\"checkbox input-sm\" data-bind=\"checked: " + value.Name + ", setCheckboxValue: { text: " + value.Name + " },uniqueName: true\" type=\"" + value.Type + "\"/></td>";
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
        scriptHeader.setAttribute('id', 'HeaderTmpl');
        scriptHeader.setAttribute('type', 'text/html');
        var htmlHeader = "<tr data-bind=\"click: sortTable\">";
        $.each($this.columns, function (key, value) {
            var colHidden = typeof value.Hidden === 'undefined' ? false : true;
            var isCustomCol = typeof value.CustomColumn === 'undefined' ? false : true;

            if (isCustomCol) {
                var c = "<th>" + value.Name + "</th>";
                htmlHeader += value.CustomColumn ? c : "";
            } else {
                htmlHeader += "<th data-column=\"" + value.Name + "\" data-bind=\"" + " visible: \$root.IsVisible(" + !colHidden + ")\">" + value.Name + "";
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
            scriptPaging.setAttribute('id', 'PagingTmpl');
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
        scriptAlert.setAttribute('id', 'alertKoGridTable');
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
            $.each($this.Columns, function (keyc, valuec) {
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
                $.each($.parseJSON(data), function (index, value) {
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
                    $this.GetDataSourece(value.DataSourceUrl, "post", value);
                    $this.RowItem[value.Name] = ko.observable(value.Name);
                    break;
                default:
                    $this.RowItem[value.Name] = ko.observable(value.Name);
                    break;
            }

        });
    };

    $this.load = function () {

        var data = {
            Orderby: escape($this.currentColumn() + ' ' + $this.sortType),
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
            $this.contacts([]);
            $this.totalRows(data.TotalRows);
            $this.contacts(dataRows);

            var calcTotalPage = Math.ceil((data.TotalRows / $this.pageSize())) - 1;
            $this.totalPages(calcTotalPage);
        });
    };

    $this.buidItemModel();
    $this.buildTemplate();
};

ko.bindingHandlers.setCheckboxValue = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        var el = $(element);
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (value.text === "1") {
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
        console.log("hfasd");
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

;