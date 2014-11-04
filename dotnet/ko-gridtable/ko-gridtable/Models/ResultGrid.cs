using System.Collections.Generic;

namespace ko_gridtable.Models
{
    public class ResultGrid<T>
    {
        public int TotalRows { get; set; }
        public IList<T> Rows { get; set; }
    }
}