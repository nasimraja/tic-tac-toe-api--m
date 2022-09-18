const express = require('express');
const router = require('express').Router();
const dbConn = require('./dbConnection')
const multer  = require('multer');
const md5 = require('md5');
const { body } = require('express-validator'); 
const auth = require("./middleware/auth") 
const app = express();


const {getGametiedByid,saveScreenshort, getwinDaybyid,getWinbyid,getLostbyid, createUser,UserList,userLogin,histryplayer,singleHistoryList,forgotpassword,getUserListById,doctor,getpatientlistbyDoctorid,getSingleUserHistory,doctorList,singleDoctor,updateDoctor,updatePatient,GetsinglePatient,GetsinglepatientHistory,updatepatientHistory, } = require('./controllers/UserController');


router.get("/api/user/list", UserList)
router.get("/api/user/list/by/:id", getUserListById)
router.post("/api/createuser", createUser)
router.post("/api/login", userLogin)
router.post("/api/histryplayer", histryplayer)
router.get("/api/history/list/:uid", singleHistoryList)
router.post("/api/doctor", doctor)
router.get("/api/get/patient/list/:doctor", getpatientlistbyDoctorid)
router.get("/api/get/single/user/history/list/:uid", getSingleUserHistory)
router.get("/api/doctor/list/:UserType", doctorList)
router.get("/api/single/doctor/:UserType/:id", singleDoctor)
router.post("/api/update/doctor/:UserType/:id", updateDoctor)
router.post("/api/update/patient/:UserType/:id", updatePatient)
router.get("/api/get/single/patient/:UserType/:id", GetsinglePatient)
router.get("/api/single/patient/history/:id", GetsinglepatientHistory)
router.post("/api/updatepatient/byowner/:id", updatepatientHistory)
router.get("/api/win/by/:uid", getWinbyid)
router.get("/api/loss/by/:uid", getLostbyid)
router.get("/api/tied/by/:uid", getGametiedByid)
router.get("/api/get/winday/:uid", getwinDaybyid)
router.post("/api/add/screenshort", saveScreenshort)

// forgot password api
router.post("/api/forgot", forgotpassword)


module.exports = router;
