using System.Collections.Generic;

namespace ko_gridtable.Models
{
    public class ResultGrid
    {
        public int TotalRows { get; set; }
        public IList<GrudUsers> Rows { get; set; }
    }
}