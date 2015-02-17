# ko-gridtable


Ko-GridTable utiliza las talbas de Bootstrap aprovechando su potencial.
Este plugins esta echo con Knockout, Jquery y FontAwesome.

## Funcionalidades hasta el momento.

- Paginado
- Ordenamiento por columnas
- Edicion Inline
    - Sopoerte de combobox y checkbox
- Mostrar error con alertas bootstrap
- Soporte Web Componet.

## Como Empezar

Para empezar solo hay que agregar la libreria de ko-gridtable despues de las siguientes librerias:

- JQuery
- FontAwesome
- Knockout

Como se muestra a continuacion.
```html
<link rel="stylesheet" href="/Content/font-awesome.min.css">
<script src="/Scripts/jquery.js">
<script src="/Scripts/knockour.3.2.js">
<script src="/Scripts/koGridTable-all.js">
<script src="/Scripts/sampleGrid.js">
```

## Script de Ejemplo "sampleGrid.js"

```javascript
$(function () {
var vm = new KoGridTable({
        Id: "grid1",
        Url: "/api/Data",
        UrlEdit: "api/Data",
        UrlAddItem: "/api/Data",
        UrlDeleteItem: "api/Data",
        Columns: [
            { Name: 'Name', Type: 'text' },
            { Name: 'LastName', Type: 'text' },
            { Name: 'Email', Type: 'text' },
            { Name: 'Id', Type: 'number', Hidden: true },
            { Name: 'Activo', Type: 'checkbox' },
            { Name: 'Sexo', Type: 'select', DataSourceUrl: '/api/ComboBox', DataText: 'Description', DataValue: 'Id', OptionsCaption: 'Elegir' },
            { Name: 'Actions', Type: 'html', CustomColumn: true, EnableAbm: true }
        ],
        EnableEditInline: true,
        DefaultPageSize: 5,
        CallbackError: function (msj, type) { cathErrorGrid(msj, type); },
        Pagings: { SelectorRang: "10-5", SelectorName: "Number of items per page:", Enable: true, NamePages: "Page: ", NameTotalCount: "Total: ", NameTotalPages: "De: " }
    });
    
    ko.applyBindings(vm, $("#grid1")[0]);
});
```

## Web Componet
Para utilizar web component el archivo js sampleGrid.js no es necesario, ya que se utilizara de la siguiente manera por medio de un tag HTML.

```html
<ko-gridtable params="
                              Id:'grid2',
                              Url: '/api/Sexo' ,
                              UrlEdit: 'api/Data2' ,
                              UrlAddItem: 'api/Data2' ,
                              UrlDeleteItem:'api/Data2' ,
                              Columns: [
                              { Name: 'Description' , Type: 'text' },
                              { Name: 'Id' , Type: 'number' , Hidden: true },

                              { Name: 'Actions' , Type: 'html' , CustomColumn: true, EnableAbm: true }
                              ],
                              EnableEditInline: true,
                              CallbackError: function (msj, type) { cathErrorGrid(msj, type); },
                              Pagings { SelectorRang: ' 10-5' , SelectorName: ' number of items per page:' , Enable: true, NamePages: ' page ' , NameTotalCount: ' total ' , NameTotalPages: ' de ' }" id="prueba2">
                </ko-gridtable>
```

## Errors
Para capturar los errores ocurridos se puede usar la propiedad de collback "CallbackError"
```javascript
function cathErrorGrid(msj, type) {
    console.log(msj);
    console.log(type);
}
```

## Nuget
Esta libreria se encuentra tambien Nuget https://www.nuget.org/packages/Ko-GridTable/.
``` 
PM> Install-Package Ko-GridTable 
```
