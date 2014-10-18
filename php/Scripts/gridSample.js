/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
;

$(function(){
    var vm = new koGridTable({
        Id: "gridSample",
        Url : "./data.php",
        //UrlEdit : "./?usuario/EditUser",
        //UrlAddItem: "./?usuario/AddUser",
        //UrlDeleteItem:"./?usuario/DeleteUser",
        Columns: [
            {Name :'Apellido', Type: 'text'},
            {Name :'Nombre', Type: 'text'},
            {Name:'Email', Type: 'text'},
            {Name:'Id', Type: 'number', Hidden: true},
            {Name:'Actions', Type: 'html', CustomColumn: true, EnableAbm: true}
        ],
        EnableEditInline : true,
        Pagings: { SelectorRang: "10-5", SelectorName: "Number of items per page:", Enable: true, NamePages: "Page: ", NameTotalCount: "Total: ", NameTotalPages: "De: " }
    });
    ko.applyBindings(vm); 
});

;