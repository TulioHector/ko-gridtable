namespace ko_gridtable.Models
{
    public class GridPaging
    {
        public string orderby { get; set; }

        public int top { get; set; }

        public int skip { get; set; }

        public int pageIndex { get; set; }

        public int pageSize { get; set; }
    }
}