using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using ko_gridtable.Models;

namespace ko_gridtable.Context
{
    public class KoGridTableContext : DbContext
    {
        public KoGridTableContext() : base("name=TourismContext")
        {

        }

        public DbSet<UserModel> Users { get; set; }
    }
}