using System;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using ko_gridtable.Context;
using ko_gridtable.Extensions;
using ko_gridtable.Models;

namespace ko_gridtable.Controllers
{
    public class DataController : ApiController
    {
        private readonly KoGridTableContext _db = new KoGridTableContext();

        [HttpGet]
        public async Task<ResultGrid<GrudUsers>> GetData(string @orderby, int pageIndex, int pageSize, int skip, int top)
        {
            var list = (from u in _db.Users
                        join c in _db.Sexo on u.Sexo.Id equals c.Id into cs
                        from ss in cs.DefaultIfEmpty()
                orderby u.Id
                select new GrudUsers
                {
                    Id = u.Id,
                    Email = u.Email,
                    Activo = u.Activo,
                    LastName = u.LastName,
                    Name = u.Name,
                    Sexo = ss.Description
                }).AsQueryable();

            var rowCount = list.Count();

            if (!String.IsNullOrEmpty(@orderby))
            {
                var order = Uri.UnescapeDataString(@orderby).Split(' ');
                var descending = order[1] == "desc";
                list = list.OrderByField(order[0], descending);
            }

            var result = new ResultGrid<GrudUsers>
            {
                TotalRows = rowCount,
                Rows = await list.Paging(pageSize, pageIndex).ToListAsync()
            };
            return result;
        }
        
        [HttpPost]
        public HttpResponseMessage Post(UserModel row)
        {
            try
            {
                var sexo = (from s in _db.Sexo
                            where s.Id == row.Sexo.Id
                            select s).First();
                row.Sexo = sexo;
                _db.Users.Add(row);
                _db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, new ResponseGrid { Message = "registro agregado", Type = "success" });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.OK, new ResponseGrid { Message = ex.Message, Type = "error" });
            }
            
        }

        [HttpPut]
        public HttpResponseMessage Put(UserModel row)
        {
            try
            {
                var user = (from u in _db.Users
                    where u.Id == row.Id
                    select u).First();

                if (row.Sexo != null)
                {
                    var sexo = (from s in _db.Sexo
                                where s.Id == row.Sexo.Id
                                select s).First();
                    user.Sexo = sexo;
                }
                user.LastName = row.LastName;
                user.Name = row.Name;
                user.Activo = row.Activo;
                _db.Users.AddOrUpdate(user);
                _db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, new ResponseGrid { Message = "registro actualizado", Type = "success" });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.OK, new ResponseGrid { Message = ex.Message, Type = "error"});
            }
        }

        [HttpDelete]
        public HttpResponseMessage Delete(UserModel row)
        {
            try
            {
                var item = (from u in _db.Users
                            where u.Id == row.Id
                            select u).First();
                _db.Users.Remove(item);
                _db.SaveChanges();
                return Request.CreateResponse(HttpStatusCode.OK, new ResponseGrid { Message = "registro eliminado", Type = "success" });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.OK, new ResponseGrid { Message = ex.Message, Type = "error" });
            }
        }
    }
}
