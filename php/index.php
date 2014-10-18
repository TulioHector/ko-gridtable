<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Ko-GridTable Sample</title>
        <link rel="stylesheet" media="all" href="Content/bootstrap/css/bootstrap.min.css" />
        <link rel="stylesheet" media="all" href="Content/fontawesome/css/font-awesome.min.css" />
        <link rel="stylesheet" media="all" href="Content/style.css" />
    </head>
    <body>
        <div role="navigation" class="navbar navbar-inverse navbar-fixed-top">
            <div class="container-fluid">
                <div class="navbar-header">
                    <button data-target=".navbar-collapse" data-toggle="collapse" class="navbar-toggle collapsed" type="button">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a href="#" class="navbar-brand">Ko-GridTable</a>
                </div>
                <div class="navbar-collapse collapse">
                    <ul class="nav navbar-nav navbar-right">
                        <li><a href="#">Dashboard</a></li>
                        <li><a href="#">Settings</a></li>
                        <li><a href="#">Profile</a></li>
                        <li><a href="#">Help</a></li>
                    </ul>
                    <form class="navbar-form navbar-right">
                        <input type="text" placeholder="Search..." class="form-control">
                    </form>
                </div>
            </div>
        </div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-3 col-md-2 sidebar">
                    <ul class="nav nav-sidebar">
                        <li class="active"><a href="#simple" id="simple">Simple</a></li>
                        <li><a href="#customCal">Custom Column</a></li>
                        <li><a href="#combobox">Combobox</a></li>
                        <li><a href="#checkbox">Checkbox</a></li>
                    </ul>
                </div>
                <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main">
                    <div class="panel panel-default">
                        <!-- Default panel contents -->
                        <div class="panel-heading" id="simple">Ejemplo Simple</div>
                        <div class="panel-body">
                            <p>A continuacion se muestra un ejemplo de uso simple, endodnde solamente se pagina</p>
                        </div>

                        <!-- Table -->
                        <table class="table table-hover table-condensed"  id="gridSample">
                            <thead data-bind="template: {name: 'HeaderTmpl'} ">                                            
                            </thead>
                            <tbody data-bind="template: { name: templateToUse, foreach: currentPage}">                                            
                            </tbody>
                            <tfoot data-bind="template: {name: 'PagingTmpl'} ">

                            </tfoot>
                        </table>
                        <div class="pull-left">
                            <button data-bind="click: add" type="button" class="btn btn-default addrow">
                                <span class="fa fa-plus-square"></span>
                            </button>
                        </div>
                    </div>

                    <div class="panel panel-default">
                        <!-- Default panel contents -->
                        <div class="panel-heading" id="customCal">Ejemplo Custom Column</div>
                        <div class="panel-body">
                            <p>A continuacion se muestra un ejemplo de uso de custom column, en dodnde veremos como agregar una column con contenido que nosotros queramos.</p>
                        </div>

                        <!-- Table -->
                        <table class="table table-hover table-condensed"  id="gridSample">
                            <thead data-bind="template: {name: 'HeaderTmpl'} ">                                            
                            </thead>
                            <tbody data-bind="template: { name: templateToUse, foreach: currentPage}">                                            
                            </tbody>
                            <tfoot data-bind="template: {name: 'PagingTmpl'} ">

                            </tfoot>
                        </table>
                        <div class="pull-left">
                            <button data-bind="click: add" type="button" class="btn btn-default addrow">
                                <span class="fa fa-plus-square"></span>
                            </button>
                        </div>
                    </div>

                    <div class="panel panel-default">
                        <!-- Default panel contents -->
                        <div class="panel-heading" id="combobox">Ejemplo Combobox</div>
                        <div class="panel-body">
                            <p>A continuacion se muestra un ejemplo de uso de ComboBox (html select) como tipo de dato un una columna.</p>
                        </div>

                        <!-- Table -->
                        <table class="table table-hover table-condensed"  id="gridSample">
                            <thead data-bind="template: {name: 'HeaderTmpl'} ">                                            
                            </thead>
                            <tbody data-bind="template: { name: templateToUse, foreach: currentPage}">                                            
                            </tbody>
                            <tfoot data-bind="template: {name: 'PagingTmpl'} ">

                            </tfoot>
                        </table>
                        <div class="pull-left">
                            <button data-bind="click: add" type="button" class="btn btn-default addrow">
                                <span class="fa fa-plus-square"></span>
                            </button>
                        </div>
                    </div>

                    <div class="panel panel-default">
                        <!-- Default panel contents -->
                        <div class="panel-heading" id="checkbox">Ejemplo Checkbox</div>
                        <div class="panel-body">
                            <p>A continuacion se muestra un ejemplo de uso de checkbox, como tipo de dato de una columna.</p>
                        </div>

                        <!-- Table -->
                        <table class="table table-hover table-condensed"  id="gridSample">
                            <thead data-bind="template: {name: 'HeaderTmpl'} ">                                            
                            </thead>
                            <tbody data-bind="template: { name: templateToUse, foreach: currentPage}">                                            
                            </tbody>
                            <tfoot data-bind="template: {name: 'PagingTmpl'} ">

                            </tfoot>
                        </table>
                        <div class="pull-left">
                            <button data-bind="click: add" type="button" class="btn btn-default addrow">
                                <span class="fa fa-plus-square"></span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>

        <script type="text/javascript" src="Scripts/jquery-2.1.1.min.js"></script>
        <script type="text/javascript" src="Scripts/bootstrap/bootstrap.min.js"></script>
        <script type="text/javascript" src="Scripts/knockout-3.2.0.js"></script>
        <script type="text/javascript" src="Scripts/ko-gridtable.js"></script>
        <script type="text/javascript" src="Scripts/gridSample.js"></script>
    </body>
</html>
