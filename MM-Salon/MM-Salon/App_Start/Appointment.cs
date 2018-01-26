using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MM_Salon.App_Start
{
    public class Appointment
    {
        public string createdDate { get; set; }
        public string createdTime { get; set; }
        public string slot { get; set; }
        public string note{ get; set; }
        public User userID { get; set; }
    }
}