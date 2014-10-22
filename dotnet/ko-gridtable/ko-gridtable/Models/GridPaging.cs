using System;

namespace ko_gridtable.Models
{
    [Serializable]
    public class GridPaging
    {
        public string Orderby { get; set; }

        public int Top { get; set; }

        public int Skip { get; set; }

        public int PageIndex { get; set; }

        public int PageSize { get; set; }
    }
}