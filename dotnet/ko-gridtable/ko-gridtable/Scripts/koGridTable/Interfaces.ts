interface IKoGridParams {
    Id: string;
    Url:string;
    UrlEdit: string;
    UrlAddItem: string;
    UrlDeleteItem: string;
    Columns: IColumns[];
    Pagings: IPaging;
    EnableEditInline: boolean;
    DefaultPageSize: number;
    CallbackError: any;
    ClassTable: string;
}

interface IColumns {
    Name: string;
    Type: string;
    Hidden: boolean;
    DataSourceUrl: string;
    DataText: string;
    DataValue: string;
    OptionsCaption: string
}

interface IPaging {
    SelectorRang: string;
    SelectorName: string;
    Enable: boolean;
    NamePages: string;
    NameTotalCount: string;
    NameTotalPages:string
}

interface KnockoutBindingHandlers {
    setCheckboxValue: KnockoutBindingHandler;
}