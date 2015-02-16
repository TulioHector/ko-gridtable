using System.Collections.Generic;

namespace CoreKoGridTable
{
    public class ResultGrid<T>
    {
        public int TotalRows { get; set; }
        public IList<T> Rows { get; set; }
    }
}