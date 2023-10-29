/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-expressions */
import React, { useEffect, useState } from "react";
import axios from "axios";

import { variables } from "../variable";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";

// import { Id } from 'node_modules/react-toastify/dist/index';

// const tokens = useSelector((state) => state.aurh.cardHeader);
const baseURL = variables.API_URL;
const [token, setToken] = useState("");

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem("@token");
    if (value !== null) {
      setToken(value);
    }
  } catch (e) {
    console.error("Failed to fetch the data from storage");
  }
};

useEffect(() => {
  getData();
}, []);

const tokenGlobal = token;
// const token = stores.getState().auth.token;
const config = {
  headers: { Authorization: `Bearer ${tokenGlobal}` },
};

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${tokenGlobal}`,
};

const headersfile = {
  "Content-Type": "multipart/form-data",
  Authorization: `Bearer ${tokenGlobal}`,
};

//auth api
const Login = (path) => (data) => {
  const promise = new Promise((resolve, reject) => {
    axios
      .get(`${baseURL}${path}`, {
        auth: {
          username: data.username,
          password: data.password,
        },
      })
      .then(
        (result) => {
          resolve(result);
        },
        (err) => {
          reject(err);
        }
      );
  });
  return promise;
};

//common api with token
const GET = (path) => {
  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .get(`${baseURL}${path}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        (result) => {
          console.log("i am get :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("err", err);
          reject(err);
        }
      );
  });
  return promise;
};

const GETParam = (path, id) => {
  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .get(`${baseURL}${path}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        (result) => {
          console.log("i am get :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("error get", err);
          reject(err);
        }
      );
  });
  return promise;
};

const GetMenu = (path, id, tokens) => {
  const promise = new Promise((resolve, reject) => {
    axios
      .get(`${baseURL}${path}/${id}`, {
        headers: { Authorization: `Bearer ${tokens}` },
      })
      .then(
        (result) => {
          console.log("i am get :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("error get", err);
          reject(err);
        }
      );
  });
  return promise;
};

const GETParam2 = (path, param1, param2) => {
  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .get(`${baseURL}${path}/${param1}/${param2}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        (result) => {
          console.log("i am get :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
  });
  return promise;
};
const GETParam3 = (path, param1, param2, param3) => {
  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .get(`${baseURL}${path}/${param1}/${param2}/${param3}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        (result) => {
          console.log("i am get :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
  });
  return promise;
};
const GETParam4 = (path, param1, param2, param3, param4) => {
  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .get(`${baseURL}${path}/${param1}/${param2}/${param3}/${param4}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(
        (result) => {
          console.log("i am get :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
  });
  return promise;
};
const GETParam5 = (path, param1, param2, param3, param4, param5) => {
  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .get(
        `${baseURL}${path}/${param1}/${param2}/${param3}/${param4}/${param5}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(
        (result) => {
          console.log("i am get :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
  });
  return promise;
};
const GETParam6 = (path, param1, param2, param3, param4, param5, param6) => {
  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .get(
        `${baseURL}${path}/${param1}/${param2}/${param3}/${param4}/${param5}/${param6}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(
        (result) => {
          console.log("i am get :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
  });
  return promise;
};

const GETBody = (path, body) => {
  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .get(`${baseURL}${path}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am post :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("config", err);

          reject(err);
        }
      );
  });
  return promise;
};

const POST = (path, body) => {
  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .post(`${baseURL}${path}`, body, {
        headers: {
          "Content-Type": "application/json",
          //   Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am post :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("config", err);

          reject(err);
        }
      );
  });
  return promise;
};

const POSTParam = (path, body, param) => {
  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .post(`${baseURL}${path}/${param}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am post :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("config", headers);

          reject(err);
        }
      );
  });
  return promise;
};
const POSTParamQS = (path, body, param, qs) => {
  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .post(`${baseURL}${path}/${param}${qs}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am post :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("config", headers);

          reject(err);
        }
      );
  });
  return promise;
};

const POSTParam2 = (path, body, param, param2) => {
  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .post(`${baseURL}${path}/${param}/${param2}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am post Param2:", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("config", headers);

          reject(err);
        }
      );
  });
  return promise;
};

const POSTParam3 = (path, body, param, param2, param3) => {
  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .post(`${baseURL}${path}/${param}/${param2}/${param3}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am post Param2:", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("config", headers);

          reject(err);
        }
      );
  });
  return promise;
};

const POSTFile = (path, id, file) => {
  var formdata = new FormData();
  formdata.append("fileupload", file);

  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .post(`${baseURL}${path}/${id}`, formdata, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am post :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("config errer", err.response.status);
          resolve(err.response.status);
        }
      );
  });
  return promise;
};
const POSTFile3 = (path, file) => {
  var formdata = new FormData();
  formdata.append("fileupload", file);

  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .post(`${baseURL}${path}`, formdata, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am post :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("config errer", err.response.status);
          resolve(err.response.status);
        }
      );
  });
  return promise;
};
// const POSTFileParam2 = (path,param1,param2,file)  => {
//     var formdata = new FormData();
//     formdata.append("fileupload",file);

//     const promise = new Promise((resolve, reject) => {
//         const token = localStorage.getItem('token');
//         axios.post(`${baseURL}${path}/${id}`
//             ,formdata
//             ,{
//                 headers: {
//                     'Content-Type' : 'application/json',
//                     Authorization: `Bearer ${token}`
//                 }
//             },
//         ).then((result)=> {
//             console.log('i am post :',result.data);
//             resolve(result.data);
//         },(err)=>{
//             console.log('config errer',err.response.status);
//             resolve(err.response.status);

//         })
//     })
//     return promise;
// }

const POSTForm = (path, form) => {
  // var formdata = new FormData();
  // formdata.append("fileupload",file);

  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .post(`${baseURL}${path}`, form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am post :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("config errer", err.response.status);
          resolve(err.response.status);
        }
      );
  });
  return promise;
};

const POSTFormConfig = (path, form, conf) => {
  // var formdata = new FormData();
  // formdata.append("fileupload",file);

  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .post(`${baseURL}${path}`, form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        ...conf,
      })
      .then(
        (result) => {
          console.log("i am post :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("config errer", err.response.status);
          resolve(err.response.status);
        }
      );
  });
  return promise;
};

const POSTFileParam = (path, param1, file) => {
  var formdata = new FormData();
  formdata.append("fileupload", file);

  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .post(`${baseURL}${path}/${param1}`, formdata, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am post :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("config errer", err.response.status);
          resolve(err.response.status);
        }
      );
  });
  return promise;
};
const POSTFileParam3 = (path, param1, param2, param3, file) => {
  var formdata = new FormData();
  formdata.append("fileupload", file);

  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .post(`${baseURL}${path}/${param1}/${param2}/${param3}`, formdata, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am post :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("config errer", err.response.status);
          resolve(err.response.status);
        }
      );
  });
  return promise;
};
const POSTFileParam4 = (path, param1, param2, param3, param4, file) => {
  var formdata = new FormData();
  formdata.append("fileupload", file);

  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .post(
        `${baseURL}${path}/${param1}/${param2}/${param3}/${param4}`,
        formdata,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(
        (result) => {
          console.log("i am post :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("config errer", err.response.status);
          resolve(err.response.status);
        }
      );
  });
  return promise;
};

const POSTFileParam3New = (path, param1, param2, param3, filename, file) => {
  var formdata = new FormData();
  formdata.append("filename", filename);
  formdata.append("fileUpload", file);

  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .post(`${baseURL}${path}/${param1}/${param2}/${param3}`, formdata, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am post :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("config errer", err.response.status);
          resolve(err.response.status);
        }
      );
  });
  return promise;
};

const POSTFiled = (path, file) => {
  var formdata = new FormData();
  formdata.append("fileupload", file);

  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .post(`${baseURL}${path}`, formdata, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am post :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("config", headers);

          reject(err);
        }
      );
  });
  return promise;
};

const POSTFileNew = (path, file, transId, atpCategoryId, workpackageid) => {
  var formdata = new FormData();
  formdata.append("fileUpload", file);
  formdata.append("transId", transId);
  formdata.append("atpCategoryId", atpCategoryId);
  formdata.append("remarks", "Upload FIle");
  formdata.append("workpackageId", workpackageid);

  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .post(`${baseURL}${path}`, formdata, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am post :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("config errer", err.response.status);
          resolve(err.response.status);
        }
      );
  });
  return promise;
};

const POSTFileBoqAttachment = (
  path,
  file,
  workpackageid,
  UploadedBy,
  remarks
) => {
  var formdata = new FormData();
  formdata.append("File", file);
  formdata.append("workpackageId", workpackageid);
  formdata.append("UploadedBy", UploadedBy);
  formdata.append("UploadedBy", UploadedBy);
  formdata.append("remarks", remarks);

  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .post(`${baseURL}${path}`, formdata, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am post :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("config errer", err.response.status);
          resolve(err.response.status);
        }
      );
  });
  return promise;
};

const POSTFileCico = (
  path,
  workpackageid,
  userId,
  activityId,
  poCategory,
  longitude,
  latitude,
  teamNameOnsite,
  file
) => {
  var formdata = new FormData();
  formdata.append("workpackageid", workpackageid);
  formdata.append("userId", userId);
  formdata.append("activityId", activityId);
  formdata.append("poCategory", poCategory);
  formdata.append("longitude", longitude);
  formdata.append("latitude", latitude);
  formdata.append("teamNameOnsite", teamNameOnsite);
  formdata.append("photoFile", file);

  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .post(`${baseURL}${path}`, formdata, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am post :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("config errer", err.response.status);
          resolve(err.response.status);
        }
      );
  });
  return promise;
};

const POSTFileNew2 = (path, file, transId, remarks, workpackageid) => {
  var formdata = new FormData();
  formdata.append("fileUpload", file);
  formdata.append("transId", transId);
  formdata.append("remarks", remarks);
  formdata.append("workpackageId", workpackageid);

  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .post(`${baseURL}${path}`, formdata, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am post :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("config errer", err.response.status);
          resolve(err.response.status);
        }
      );
  });
  return promise;
};

const POSTFileNew3 = (
  path,
  file,
  tpSiteDocId,
  transProccesId,
  workpackageid,
  docName
) => {
  // const dispatch = useDispatch()
  var formdata = new FormData();
  formdata.append("fileUpload", file);
  formdata.append("tpSiteDocId", tpSiteDocId);
  formdata.append("transProccesId", transProccesId);
  formdata.append("workpackageId", workpackageid);
  formdata.append("docName", docName);

  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    // const dispatch = useDispatch()
    const [progress, setProgress] = useState(null);

    axios
      .post(`${baseURL}${path}`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },

        onUploadProgress: (data) => {
          const percentCompleted = Math.round((data.loaded * 100) / data.total);
          console.log(percentCompleted, "upload data");
          setProgress(percentCompleted);
          //  useDispatch(setUploadProgress(percentCompleted))
        },
      })
      .then(
        (result) => {
          console.log("i am post :", result.data);
          resolve(result.data);
          // useDispatch(setUploadProgress(result))
        },
        (err) => {
          console.log("config errer", err.response.status);
          resolve(err.response.status);
        }
      );
  });
  return promise;
};
const POSTFileNew4 = (path, file, workpackageid, isRevise) => {
  var formdata = new FormData();
  formdata.append("fileUpload", file);

  formdata.append("wpid", workpackageid);
  formdata.append("isRevise", isRevise);

  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .post(`${baseURL}${path}`, formdata, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am post :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("config errer", err.response.status);
          resolve(err.response.status);
        }
      );
  });
  return promise;
};

const POSTFileNewArray = (
  path,
  file,
  transId,
  atpCategoryId,
  workpackageid
) => {
  var formdata = new FormData();
  var rs;
  file.forEach((files) => {
    formdata.append("files[]", files);

    formdata.append("transId", transId);
    formdata.append("atpCategoryId", atpCategoryId);
    formdata.append("remarks", "test remarks via upload");
    formdata.append("workpackageId", workpackageid);

    const promise = new Promise((resolve, reject) => {
      const token = localStorage.getItem("token");
      axios
        .post(`${baseURL}${path}`, formdata, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
        .then(
          (result) => {
            console.log("i am post :", result.data);
            resolve(result.data);
          },
          (err) => {
            console.log("config errer", err.response.status);
            resolve(err.response.status);
          }
        );
    });

    rs = promise;
  });
  return rs;
};

const POSTFileAddhoc = (path, file, adhocDocId, docName, LMBY) => {
  var formdata = new FormData();
  formdata.append("File", file);

  formdata.append("adhocDocId", adhocDocId);
  formdata.append("docName", docName);
  formdata.append("docName", "test remarks via upload");
  formdata.append("LMBY", LMBY);

  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .post(`${baseURL}${path}`, formdata, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am post :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("config errer", err.response.status);
          resolve(err.response.status);
        }
      );
  });
  return promise;
};

const POSTFileParam1 = (path, file, param1) => {
  var formdata = new FormData();
  formdata.append("fileupload", file);

  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .post(`${baseURL}${path}/${param1}`, formdata, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am post :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("config", headers);

          reject(err);
        }
      );
  });
  return promise;
};
const POSTFileParam2 = (path, param1, param2, file) => {
  var formdata = new FormData();
  formdata.append("fileupload", file);

  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .post(`${baseURL}${path}/${param1}/${param2}`, formdata, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am post :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log("config", headers);

          reject(err);
        }
      );
  });
  return promise;
};

const PUTFile = (path, id) => {
  var formdata = new FormData();
  // formdata.append("fileupload",file);
  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .put(`${baseURL}${path}/${id}`, formdata, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am PUTFILE :", result.data);
          resolve(result.data);
        },
        (err) => {
          reject(err);
        }
      );
  });
  return promise;
};

const PUT = (path, body) => {
  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .put(`${baseURL}${path}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am put :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log(err);
          reject(err);
        }
      );
  });
  return promise;
};

const PUTParam = (path, body, id) => {
  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .put(`${baseURL}${path}/${id}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am get :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log(config);
          reject(err);
        }
      );
  });
  return promise;
};
const PUTParam2 = (path, body, param1, param2) => {
  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .put(`${baseURL}${path}/${param1}/${param2}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am get :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log(config);
          reject(err);
        }
      );
  });
  return promise;
};

const DELETE = (path, param) => {
  const promise = new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`${baseURL}${path}/${param}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(
        (result) => {
          console.log("i am put :", result.data);
          resolve(result.data);
        },
        (err) => {
          console.log(config);
          reject(err);
        }
      );
  });
  return promise;
};

const DELETEParam = (path, body, param) => {
  console.log(param, "paramdelete");
  const promise = new Promise((resolve, reject) => {
    axios.delete(`${baseURL}${path}/${param}`, body, { headers }).then(
      (result) => {
        console.log("i am post :", result.data);
        resolve(result.data);
      },
      (err) => {
        console.log("config", headers);

        reject(err);
      }
    );
  });
  return promise;
};

const getIdentity = () => GET("me");
const postLogin = (body) => POST("api/Auth/Login", body);

const API = {
  Login,
  postLogin,
  getIdentity,
};

export default API;
