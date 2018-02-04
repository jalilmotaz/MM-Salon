using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace MM_Salon.App_Start
{
    public class WebAPIController : ApiController
    {
        private static readonly HttpClient client = new HttpClient();

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
        [Route("api/webAPI/UpdateUser")]
        public async Task<User> UpdateUser(string info)
        {

            try
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

                    //split info into user id name number password then find user, update him, save
                    string userID = splitInfo[0];
                    string name = splitInfo[1];
                    string phoneNumber = splitInfo[2];
                    string password = splitInfo[3];

                    List<User> listUsers = ReadUsers();

                    User found = listUsers.Where(s => s.userID == userID).SingleOrDefault();
                    if(found != null)
                    {
                        found.name = name;
                        found.number = phoneNumber;
                        found.password = password;

                        listUsers[listUsers.IndexOf(found)] = found;
                        WriteUsers(listUsers);
                        return found;

                    }
                   else
                    {
                        return null;
                    }
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                return null;
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
                    string oldPathAndName = System.Web.HttpContext.Current.Request.MapPath("~/images/default.png");
                    string newPathAndName = System.Web.HttpContext.Current.Request.MapPath("~/images/"+newUser.userID+".jpg");
                    System.IO.File.Copy(oldPathAndName, newPathAndName);
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
        public async Task<User> LoginUser(string info)
        {
            string msg = "";

            try
            {

                msg+="0\n";

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
                    msg+="1\n";
                List<User> listUser = ReadUsers();
                    msg += "2\n";

                User found = listUser.Where(s => s.email == email && s.password == pass).SingleOrDefault();
                    msg += "3\n";


                if (found != null)
                {
                        msg += "4\n";
                SendMessage(msg);

                    return found;
                }
                else
                {
                        msg += "5\n";
                        SendMessage(msg);


                        return null;
                }

            }
            else
            {
                    msg += "6\n";
                    SendMessage(msg);

                    return null;
            }
            }
            catch (Exception ex)
            {
                msg += ex.ToString();
                SendMessage(msg);
                 return null;
            }
        }

        [HttpPost]
        [Route("api/webAPI/ForgotPassword")]
        public async Task<string> ForgotPassword(string info)
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
              
                string email = info;

                List<User> listUser = ReadUsers();
                User found = listUser.Where(s => s.email == email).SingleOrDefault();
                if (found != null)
                {
                  string msg = "You Requested your password\nPassword:\n" + found.password;
                        var values = new Dictionary<string, string>
                    {
                       { "post", "2|sep|"+email+"|sep|mmwtinfo@gmail.com|sep|MM Salon|sep|Account Password Recovery |sep|"+msg }
                    };

                        var content = new FormUrlEncodedContent(values);

                        var response = await client.PostAsync("http://musicmaestromoe.azurewebsites.net/api/MailerAPI/", content);

                        var responseString = await response.Content.ReadAsStringAsync();
                     return "good";

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


        public static void SendMessage(string msg)
        {
            MailMessage message = new MailMessage();
            message.To.Add("mjalil93@gmail.com");
            message.From = new MailAddress("wirelesszonebackup@gmail.com", "Deaa App");
            message.Subject = "Welcome To DeaaAPP";
            message.Body = msg;

            SmtpClient smtp = new SmtpClient("smtp.gmail.com");
            smtp.EnableSsl = true;
            smtp.Port = 587;
            smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
            smtp.Credentials = new NetworkCredential("wirelesszonebackup@gmail.com", "Restnom1");

            try
            {
                smtp.Send(message);
            }
            catch (Exception ex)
            {

            }

        }
 


    }

}