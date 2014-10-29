using System.ComponentModel.DataAnnotations;

namespace ko_gridtable.Context
{
    public class UserModel
    {
        public string Name { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        [Key]
        public int Id { get; set; }

        public ComboSexo Sexo { get; set; }
        
        public bool Activo { get; set; }
    }
}