using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ko_gridtable.Models
{
    public class ResultGrid
    {
        public int TotalRows { get; set; }
        public IList<UserModel> Rows { get; set; }
    }
}