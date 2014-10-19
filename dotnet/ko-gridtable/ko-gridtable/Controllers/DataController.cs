using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Web.Script.Serialization;
using ko_gridtable.Models;

namespace ko_gridtable.Controllers
{
    public class DataController : ApiController
    {
        public IList<UserModel> List = new List<UserModel>();
        public ResultGrid GetData(string grid)
        {
            var jsonSerializer = new JavaScriptSerializer();
            var paging = jsonSerializer.Deserialize<GridPaging>(grid);
            for (var i = 0; i < 100; i++)
            {
                var model = new UserModel
                {
                    Email = string.Format("Email_{0}@company.com", i),
                    Id = i,
                    LastName = string.Format("LastName_{0}", i),
                    Name = string.Format("Name_{0}", i)
                };
                List.Add(model);
            }
            
            var result = new ResultGrid
            {
                TotalRows = List.Count,
                Rows = List.Skip(paging.skip).Take(paging.pageSize).ToList()
            };
            return result;
        }

        
    }
}
