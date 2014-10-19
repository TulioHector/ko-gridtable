;

$(function() {
    var vm = new koGridTable({
        Id: "gridSample",
        Url: "/api/Data",
        //UrlEdit : "./?usuario/EditUser",
        //UrlAddItem: "./?usuario/AddUser",
        //UrlDeleteItem:"./?usuario/DeleteUser",
        Columns: [
            { Name: 'Name', Type: 'text' },
            { Name: 'LastName', Type: 'text' },
            { Name: 'Email', Type: 'text' },
            { Name: 'Id', Type: 'number', Hidden: true }//,
            //{ Name: 'Actions', Type: 'html', CustomColumn: true, EnableAbm: true }
        ],
        EnableEditInline: true,
        Pagings: { SelectorRang: "10-5", SelectorName: "Number of items per page:", Enable: true, NamePages: "Page: ", NameTotalCount: "Total: ", NameTotalPages: "De: " }
    });
    ko.applyBindings(vm);
});

;