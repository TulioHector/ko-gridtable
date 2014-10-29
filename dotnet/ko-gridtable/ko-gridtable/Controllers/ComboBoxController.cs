using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using ko_gridtable.Context;

namespace ko_gridtable.Controllers
{
    public class ComboBoxController : ApiController
    {
        private readonly KoGridTableContext _db = new KoGridTableContext();

        [HttpGet]
        public IList<ComboSexo> Get()
        {
            var comboSexo = (from s in _db.Sexo
                select s).ToList();
            return comboSexo;
        }
    }
}
