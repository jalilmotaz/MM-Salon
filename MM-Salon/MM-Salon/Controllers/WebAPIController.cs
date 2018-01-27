using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
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
        public string UploadImage()
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

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}