using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ko_gridtable.Models
{
    public class GrudUsers
    {
        public string Name { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public int Id { get; set; }

        public string Sexo { get; set; }

        public bool Activo { get; set; }
    }
}