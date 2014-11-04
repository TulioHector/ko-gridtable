using System;
using System.Collections.Generic;
using System.Data.Entity;
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
    public class SexoController : ApiController
    {
        private readonly KoGridTableContext _db = new KoGridTableContext();
        [HttpGet]
        public async Task<ResultGrid<GridSexo>> GetSexo(string @orderby, int pageIndex, int pageSize, int skip, int top)
        {
            var list = (from s in _db.Sexo
                        orderby s.Description
                        select new GridSexo
                        {
                            Id = s.Id,
                            Description = s.Description
                        }).AsQueryable();
            var rowCount = list.Count();
            if (!String.IsNullOrEmpty(@orderby))
            {
                var order = Uri.UnescapeDataString(@orderby).Split(' ');
                var descending = order[1] == "desc";
                list = list.OrderByField(order[0], descending);
            }

            var result = new ResultGrid<GridSexo>
            {
                TotalRows = rowCount,
                Rows = await list.Paging(pageSize, pageIndex).ToListAsync()
            };
            return result;
        }
    }
}
