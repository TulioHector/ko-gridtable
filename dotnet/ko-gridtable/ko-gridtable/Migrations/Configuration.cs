using System.Collections.Generic;
using ko_gridtable.Context;
using ko_gridtable.Models;

namespace ko_gridtable.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<ko_gridtable.Context.KoGridTableContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
        }

        protected override void Seed(ko_gridtable.Context.KoGridTableContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //
            for (var i = 0; i < 100; i++)
            {
                var model = new UserModel
                {
                    Email = string.Format("Email_{0}@company.com", i),
                    Id = i,
                    LastName = string.Format("LastName_{0}", i),
                    Name = string.Format("Name_{0}", i)
                };

                context.Users.AddOrUpdate(model);
            }

            var sexoM = new ComboSexo
            {
                Id = 0,
                Description = "Masculino"
            };
            var sexoF = new ComboSexo
            {
                Id = 0,
                Description = "Femenino"
            };

            context.Sexo.AddOrUpdate(sexoM);
            context.Sexo.AddOrUpdate(sexoF);
        }
    }
}
