using System.Linq;
using ko_gridtable.Context;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(ko_gridtable.App_Start.AppStartConfig), "Start")]
namespace ko_gridtable.App_Start
{
    public class AppStartConfig
    {
        public static void Start()
        {
            
        }
    }
}