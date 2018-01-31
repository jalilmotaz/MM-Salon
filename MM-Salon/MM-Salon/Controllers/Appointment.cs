using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MM_Salon.App_Start
{
    public class Appointment
    {
        public string createdDate { get; set; }
        public string scheduledate { get; set; }
        public string seats { get; set; }
        public string note{ get; set; }
        public User user { get; set; }
    }
}