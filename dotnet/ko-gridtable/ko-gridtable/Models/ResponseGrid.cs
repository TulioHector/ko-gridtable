using System;
using System.Runtime.Serialization;

namespace ko_gridtable.Models
{
    [Serializable]
    [DataContract]
    public class ResponseGrid
    {
        [DataMember]
        public string Type { get; set; }

        [DataMember]
        public string Message { get; set; }
    }
}