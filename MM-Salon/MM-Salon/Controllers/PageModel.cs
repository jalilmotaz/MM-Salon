using MM_Salon.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MM_Salon.App_Start
{
    public class PageModel
    {
        public HomePage homePage { get; set; }
        public List<Appointment> appointments { get; set; }
        public List<string> holidays { get; set; }
        public string seats { get; set; }
        public List<Review> reviews { get; set; }
    }
}