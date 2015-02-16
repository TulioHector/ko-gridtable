using System;
using System.Runtime.Serialization;

namespace CoreKoGridTable
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