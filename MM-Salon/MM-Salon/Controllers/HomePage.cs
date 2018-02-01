using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MM_Salon.App_Start
{
    public class HomePage
    {
        public string aboutUsTxt { get; set; }
        public string aboutUsStoreImg { get; set; }
        public List<string> imgSlides { get; set; }
        public List<string> workGallery { get; set; }
        public List<string> specialties { get; set; }
        public List<Employee> team { get; set; }
        public string email { get; set; }
        public string address { get; set; }
        public string number { get; set; }
        public string fbLink { get; set; }
        public string twitterLink { get; set; }
        public string instaLink { get; set; }
        public string[] hours { get; set; }
    }
}