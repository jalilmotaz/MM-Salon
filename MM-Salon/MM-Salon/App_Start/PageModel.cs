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
    }
}