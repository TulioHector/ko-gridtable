using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Web.Http;
using System.Web.Script.Serialization;
using ko_gridtable.Context;
using ko_gridtable.Models;
using Newtonsoft.Json;

namespace ko_gridtable.Controllers
{
    public class DataController : ApiController
    {
        private KoGridTableContext _db = new KoGridTableContext();
        //public IList<UserModel> List = new List<UserModel>();

        [HttpGet]
        public ResultGrid GetData(string @orderby, int pageIndex, int pageSize, int skip, int top)
        {
            var list = (from u in _db.Users
                select u).ToList();
            var result = new ResultGrid
            {
                TotalRows = list.Count,
                Rows = list.Skip(skip).Take(pageSize).ToList()
            };
            return result;
        }

        [HttpPost]
        public void Post(UserModel row)
        {
            if (row != null)
            {
                _db.Users.Add(row);
                _db.SaveChanges();
            }
        }

        [HttpPut]
        public void Put(UserModel row)
        {
            if (row != null)
            {
                _db.Users.AddOrUpdate(row);
                _db.SaveChanges();
            }
        }

        [HttpDelete]
        public void Delete()
        {

        }
    }
}
