using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace ko_gridtable.Extensions
{
    /// <summary>
    /// http://www.tulio-wiki.com.ar/2013/11/08/como-extender-ef-para-ordenar-campos-dinamicamente/
    /// </summary>
    public static class DynamicQueryable
    {
        public static IQueryable<T> OrderByField<T>(this IQueryable<T> query, string sortField, bool @ascending)
        {
            var param = Expression.Parameter(typeof(T), "p");
            var prop = Expression.Property(param, sortField);
            var exp = Expression.Lambda(prop, param);
            var method = @ascending ? "OrderBy" : "OrderByDescending";
            var types = new[] { query.ElementType, exp.Body.Type };
            var mce = Expression.Call(typeof(Queryable), method, types, query.Expression, exp);
            return query.Provider.CreateQuery<T>(mce);
        }

        public static IQueryable<T> Paging<T>(this IQueryable<T> en, int pageSize, int page)
        {
            return en.Skip(page * pageSize).Take(pageSize);
        }
 
        public static IEnumerable<T> Paging<T>(this IEnumerable<T> en, int pageSize, int page)
        {
            return en.Skip(page * pageSize).Take(pageSize);
        }
    }
}