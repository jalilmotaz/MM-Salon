using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace MM_Salon.App_Start
{
    public class WebAPIController : ApiController
    {

        [HttpPost]
        [Route("api/webAPI/SetPageModel")]
        public string SetPageModel([FromBody] PageModel info)
        {

            try
            {
                if (info != null)
                {

                    string pageJson = JsonConvert.SerializeObject(info);
                    File.WriteAllText(System.Web.HttpContext.Current.Request.MapPath("~/PageModel.json"), pageJson);

                    return "good";
                }
                else
                {
                   
                 
                    return "bad";
                }
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }



        }


        [HttpPost]
        [Route("api/webAPI/UploadImage")]
        public string UploadImage(string info)
        {
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            if (HttpContext.Current.Request.Files.AllKeys.Any())
            {
                // Get the uploaded image from the Files collection

                var httpPostedFile = HttpContext.Current.Request.Files["UploadedImage"];

                if (httpPostedFile != null)
                {
                    string fileName = HttpContext.Current.Request["name"];
                    if (File.Exists(System.Web.HttpContext.Current.Request.MapPath("~/images/" + fileName)))
                    {
                        File.Delete(System.Web.HttpContext.Current.Request.MapPath("~/images/" + fileName));
                    }
                   
                    httpPostedFile.SaveAs(System.Web.HttpContext.Current.Request.MapPath("~/images/" + fileName));

                    return "good";
                }
                else
                {
                    return "bad";
                }
            }
            else
            {
                return "bad";
            }
        }


        private List<User> ReadUsers()
        {

            try
            {
                string jsonString = File.ReadAllText(System.Web.HttpContext.Current.Request.MapPath("~/Users.json"));
                List<User> listUser = JsonConvert.DeserializeObject<List<User>>(jsonString);

                return (listUser == null) ? new List<User>() : listUser;
            }
            catch (Exception ex)
            {
                ex.ToString();
                return new List<User>();
            }

        }
        private string WriteUsers(List<User> list)
        {
            try
            {
                string jsonString = JsonConvert.SerializeObject(list);
                File.WriteAllText(System.Web.HttpContext.Current.Request.MapPath("~/Users.json"), jsonString);

                return "good";

            }
            catch (Exception ex)
            {
                return ex.ToString();

            }

        }



        [HttpPost]
        [Route("api/webAPI/CreateUser")]
        public async Task<string> CreateUser(string info)
        {
            using (var c = await this.Request.Content.ReadAsStreamAsync())
            {
                c.Seek(0, SeekOrigin.Begin);
                using (var s = new StreamReader(c))
                {
                    info = s.ReadToEnd();
                }
            }

            if (info != "")
            {
                string[] splitInfo = info.Split(new string[] { "|sep|" }, StringSplitOptions.None);

                User newUser = new User();

                List<User> listUser = ReadUsers();
                User found = listUser.Where(s => s.email == splitInfo[2]).SingleOrDefault();
                if (found != null)
                {
                    return "exists";
                }
                else
                {
                    newUser.userID = splitInfo[0];
                    newUser.name = splitInfo[1];
                    newUser.email = splitInfo[2];
                    newUser.number = splitInfo[3];
                    newUser.password = splitInfo[4];
                    

                    listUser.Add(newUser);

                    WriteUsers(listUser);

                    return "good";
                }

            }
            else
            {
                return "no info sent";
            }
        }

        [HttpPost]
        [Route("api/webAPI/LoginUser")]
        public async Task<string> LoginUser(string info)
        {
            using (var c = await this.Request.Content.ReadAsStreamAsync())
            {
                c.Seek(0, SeekOrigin.Begin);
                using (var s = new StreamReader(c))
                {
                    info = s.ReadToEnd();
                }
            }

            if (info != "")
            {
                string[] splitInfo = info.Split(new string[] { "|sep|" }, StringSplitOptions.None);

                string email = splitInfo[0];
                string pass = splitInfo[1];
                
                List<User> listUser = ReadUsers();
                User found = listUser.Where(s => s.email == email && s.password == pass).SingleOrDefault();
                if (found != null)
                {
                    return found.userID;
                }
                else
                {
                    
                    return "bad";
                }

            }
            else
            {
                return "no info sent";
            }
        }


    }
}