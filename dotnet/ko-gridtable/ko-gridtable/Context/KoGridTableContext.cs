using System.Data.Entity;
using ko_gridtable.Models;

namespace ko_gridtable.Context
{
    public class KoGridTableContext : DbContext
    {
        public KoGridTableContext() : base("name=TourismContext")
        {

        }

        public DbSet<UserModel> Users { get; set; }
        public DbSet<ComboSexo> Sexo { get; set; }
    }
}