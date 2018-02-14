using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MM_Salon.Controllers
{
    public class Review
    {
        public string reviewID { get; set; }
        public string name { get; set; }
        public string review { get; set; }
        public string rating { get; set; }
        public string date { get; set; }
        public string userID { get; set; }
    }
}