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
'use strict';
var BaseViewModel = (function () {
    function BaseViewModel(params) {
        this.selectedItem = ko.observable("");
        this.rowItem = {};
        this.collectionItems = ko.observableArray([]);
        this.selectedChoice = ko.observable("");
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
            } else {
                //commit(true);
                this.load();
            }
        });
    };
    return BaseViewModel;
})();
;
//# sourceMappingURL=BaseViewModel.js.map
