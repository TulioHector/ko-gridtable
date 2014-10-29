using System.ComponentModel.DataAnnotations;

namespace ko_gridtable.Context
{
    public class ComboSexo
    {
        [Key]
        public int Id { get; set; }

        public string Description { get; set; }
    }
}