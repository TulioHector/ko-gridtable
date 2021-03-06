﻿/* 
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
class BaseViewModel {
    public selectedItem: KnockoutObservable<any> = ko.observable("");
    public idGrid: string;
    public url: string;
    public editUrl: string;
    public addUrl: string;
    public deleteUrl: string;
    public rowItem = {};
    public collectionItems: KnockoutObservableArray<any> = ko.observableArray([]);
    public selectedChoice: KnockoutObservable<string> = ko.observable("");
    public columns: IColumns[];
    public classTable: string = "";

    constructor(params: IKoGridParams) {
        this.idGrid = params.Id;
    }

    public templateToUse(item) {
        var tmpl = this.selectedItem() === item ? this.idGrid + '_EditTmpl' : this.idGrid + '_ItemsTmpl';
        return tmpl;
    }

    public templateHeader() {
        return this.idGrid + "_HeaderTmpl";
    }

    public templateFoot() {
        return this.idGrid + "_PagingTmpl";
    }

    public edit(item) {
        this.selectedItem(item);
    }

    public cancel() {
        this.selectedItem(null);
    }

    public add() {
        var newItem = this.rowItem;
        this.collectionItems.push(newItem);
        this.selectedItem(newItem);
    }

    public remove(itemToDelete) {
        this.removeItem(itemToDelete);
    }

    private removeItem(itemToDelete) {
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
    }
};