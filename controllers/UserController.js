const md5 = require('md5')
const dbConn = require('../dbConnection')
require('dotenv').config()
const nodemailer = require("nodemailer");
const { query } = require('../dbConnection');



// user list
exports.UserList = (req, resp) => {

    

    dbConn.query("select * from users;", (err, users) => {
        if (err)
            throw new Error(err)
        return resp.status(200).json({
            success: true,
            users
        })

    })
}


exports.createUser = (req, resp) => {

    const userData = req.body;


    dbConn.query('SELECT * FROM users WHERE email = ?', [req.body.email], (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'DB error',
            })
        } else {
            if (result.length > 0) {
                resp.status(400).json({
                    success: false,
                    message: 'Account already exist with this email',
                })
            }
        }
        console.log(result)
        console.log(userData)
        dbConn.query("INSERT INTO users SET ?", userData, (error, result) => {
            if (error) {
                resp.status(500).json({
                    success: false,
                    message: 'Somothing went wrong'
                })
            }
            else {
                resp.status(200).json({
                    success: true,
                    message: 'User Successfully register',
                    id: result.insertId,
                    name: userData.name,
                    email: userData.email,
                    UserType: userData.UserType

                })
            }
        })

    })
}

exports.getUserListById = (req, resp) => {
    dbConn.query('SELECT * FROM users WHERE id =  ?', [req.params.id], (err, result) => {
        if (err) {
            resp.status(500).json({
                success: false,
                message: 'Somothing went wrong'
            })
        }
        else {
            let _resp = {
                success: true,
                data: result
            }
            console.log(_resp);
            return resp.status(200).json(_resp)
        }

    })
}

exports.userLogin = (req, resp) => {

    dbConn.query('SELECT * FROM users WHERE email = ? and password = ?', [req.body.email, req.body.password], (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'DB error',
            })
        } else {
            if (result.length > 0) {
                resp.status(200).json({
                    success: true,
                    message: 'login Successfully',
                    id: result[0].id,
                    name: result[0].name,
                    email: result[0].email,
                    UserType: result[0].UserType
                })
            }
            else {
                let _resp = {
                    success: false,
                    message: 'log  failed',
                }
                console.log(_resp);
                resp.status(404).json(_resp)
            }
        }


    })
}

exports.getUserListById = (req, resp) => {
    dbConn.query('SELECT * FROM users WHERE id =  ?', [req.params.id], (err, result) => {
        if (err) {
            resp.status(500).json({
                success: false,
                message: 'Somothing went wrong'
            })
        }
        else {
            let _resp = {
                success: true,
                data: result
            }
            console.log(_resp);
            return resp.status(200).json(_resp)
        }

    })
}

exports.gameProvider = (req, resp) => {

    dbConn.query('SELECT * FROM users WHERE email = ?', [req.body.email], (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'DB error',
            })
        } else {
            if (result.length > 0) {
                resp.status(200).json({
                    success: true,
                    message: 'Successfully Added',
                })
            }
        }


    })
}

exports.histryplayer = ((req, resp) => {
    const Data = req.body;
    dbConn.query("INSERT INTO histroy SET ?", Data, (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'Somothing went wrong'
            })
        }
        else {
            resp.status(200).json({
                success: true,
                message: 'player data inserted',

            })
        }
    })
})

exports.singleHistoryList = (req, resp) => {
    console.log(req.params.uid)
    dbConn.query('SELECT * FROM histroy WHERE uid =  ?', [req.params.uid], (err, result) => {
        if (err) {
            resp.status(500).json({
                success: false,
                message: 'Somothing went wrong'
            })
        }
        else {
            let _resp = {
                success: true,
                data: result
            }
            console.log(_resp);
            return resp.status(200).json(_resp)
        }

    })
}



async function sendMail(toAddress, subject, text, html) {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    // let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER, // generated ethereal user
            pass: process.env.SMTP_PASS, // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"tic toc" <>', // sender address
        to: toAddress, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    });

    console.log("Message sent: %s", info.messageId);

}

exports.forgotpassword = (req, resp) => {
    console.log(req.body.email)
    dbConn.query('SELECT * FROM users WHERE email = ?', [req.body.email], (err, result) => {
        if (err) {
            resp.status(500).json({
                success: false,
                message: 'DB error'
            })
        } else {
            if (result.length > 0) {
                const random = (Math.random() + 1).toString(36).substring(7);
                sendMail(
                    result[0].email,
                    'password reset request',
                    'You recently requested to reset password.',
                    'You recently requested to reset password.',
                    '<p>Please click here to <a href="http://localhost:3000/reset/password/"> reset</a> your password</p>'


                );
                console.log(result[0].id)
                dbConn.query("UPDATE users SET resetpassword = ? WHERE id = ? ", [random, result[0].id], (error, result) => {
                    if (error) throw error;
                    if (result) {
                        resp.status(200).json({
                            success: true,
                            message: 'token inserted'
                        })
                    }
                });

            }
            else {
                resp.status(400).json({
                    success: false,
                    message: 'your email not exit my database please register',
                })
            }
        }

    })
}

exports.updatepass = (req, resp) => {

    dbConn.query('SELECT * FROM users WHERE resetpassword = ?', [req.body.resetpassword], (error, result) => {

        if (error) {
            resp.status(500).json({
                success: false,
                message: 'DB error',
            })
        } else {

            if (result) {
                console.log(req.body.pass)
                console.log(req.body.resetpassword)
                dbConn.query("UPDATE users SET pass = ? WHERE resetpassword = ? ", [req.body.pass, req.body.resetpassword], (error, updatedresult) => {
                    if (error) throw error;
                    if (updatedresult) {
                        resp.status(200).json({
                            success: true,
                            message: 'password updated'
                        })
                    }
                });

            } else {
                resp.status(400).json({
                    success: false,
                    message: 'back to home page',
                })
            }
        }
    })
}

exports.doctor = (req, resp) => {

    const userType3data = req.body;


    dbConn.query('SELECT * FROM users WHERE email = ?', [req.body.email], (error, result) => {
        if (error) {
            resp.status(500).json({
                success: false,
                message: 'DB error',
            })
        } else {
            if (result.length > 0) {
                resp.status(400).json({
                    success: false,
                    message: 'Account already exist with this email',
                })
            }
        }

        dbConn.query("INSERT INTO users SET ?", userType3data, (error, result) => {
            if (error) {
                resp.status(500).json({
                    success: false,
                    message: 'Somothing went wrong'
                })
            }
            else {
                resp.status(200).json({
                    success: true,
                    message: 'Added Successfully',

                })
            }
        })

    })
}

exports.getpatientlistbyDoctorid = (req, resp) => {
    console.log(req.params.doctor)
    dbConn.query('SELECT * FROM users WHERE doctor =  ?', [req.params.doctor], (err, result) => {
        if (err) {
            resp.status(500).json({
                success: false,
                message: 'Somothing went wrong'
            })
        }
        else {
            let _resp = {
                success: true,
                data: result
            }
            console.log(_resp);
            return resp.status(200).json(_resp)
        }

    })
}

exports.getSingleUserHistory = (req, resp) => {
    console.log(req.params.uid)
    dbConn.query('SELECT * FROM histroy WHERE uid = ?', [req.params.uid], (err, result) => {
        if (err) {
            resp.status(500).json({
                success: false,
                message: 'Somothing went wrong'
            })
        }
        else {
            let _resp = {
                success: true,
                data: result
            }
            console.log(_resp);
            return resp.status(200).json(_resp)
        }

    })
}


exports.doctorList = (req, resp) => {
    console.log(req.params.UserType);
    dbConn.query('SELECT * FROM users WHERE  UserType = 2', [req.params.UserType], (err, result) => {
        if (err) {
            resp.status(500).json({
                success: false,
                message: 'Somothing went wrong'
            })
        }
        else {
            let _resp = {
                success: true,
                data: result
            }
            console.log(_resp);
            return resp.status(200).json(_resp)
        }

    })
}

exports.singleDoctor = (req, resp) => {
    console.log(req.params.UserType)
    console.log(req.params.id)
    dbConn.query('SELECT * FROM users WHERE UserType = ? and id = ?', [req.params.UserType, req.params.id], (err, result) => {
        if (err) {
            resp.status(500).json({
                success: false,
                message: 'Somothing went wrong'
            })
        }
        else {
            let _resp = {
                success: true,
                data: result
            }
            console.log(_resp);
            return resp.status(200).json(_resp)
        }
    })

}

exports.updateDoctor = (req, resp) => {
    dbConn.query('SELECT * FROM users WHERE email = ? and id != ?', [req.body.email, req.params.id], (err, result) => {
        if (err) {
            resp.status(500).json({
                success: false,
                message: 'DB error',
                error: err
            })
        } else {
            if (result.length > 0) {
                resp.status(400).json({
                    success: false,
                    message: 'Account already exist with this email',
                })
            }
            else {
                dbConn.query('UPDATE users SET name =?,email = ?,password =? WHERE UserType = ? and id = ?', [req.body.name, req.body.email, req.body.password, req.params.UserType, req.params.id], (err, doctor) => {
                    if (err) {
                        resp.status(500).json({
                            success: false,
                            message: 'DB error',
                            error: err
                        })
                    } else {
                        resp.status(200).json({
                            success: true,
                            message: 'Updated Successfully',

                        })
                    }
                })
            }


        }
    })
}

exports.updatePatient = (req, resp) => {
    dbConn.query('SELECT * FROM users WHERE email = ? and id != ?', [req.body.email, req.params.id], (err, result) => {
        if (err) {
            resp.status(500).json({
                success: false,
                message: 'DB error',
                error: err
            })
        } else {
            if (result.length > 0) {
                resp.status(400).json({
                    success: false,
                    message: 'Account already exist with this email',
                })
            }
            else {
                dbConn.query('UPDATE users SET name =?,email = ?,password =? WHERE UserType = ? and id = ?', [req.body.name, req.body.email, req.body.password, req.params.UserType, req.params.id], (err, doctor) => {
                    if (err) {
                        resp.status(500).json({
                            success: false,
                            message: 'DB error',
                            error: err
                        })
                    } else {
                        resp.status(200).json({
                            success: true,
                            message: 'Updated Successfully',

                        })
                    }
                })
            }


        }
    })
}

exports.GetsinglePatient = (req, resp) => {
    console.log(req.params.UserType)
    console.log(req.params.id)
    dbConn.query('SELECT * FROM users WHERE UserType = ? and id = ?', [req.params.UserType, req.params.id], (err, result) => {
        if (err) {
            resp.status(500).json({
                success: false,
                message: 'Somothing went wrong'
            })
        }
        else {
            let _resp = {
                success: true,
                data: result
            }
            console.log(_resp);
            return resp.status(200).json(_resp)
        }
    })

}
exports.GetsinglepatientHistory = (req, resp) => {
    console.log(req.params.id)
    dbConn.query('SELECT * FROM histroy WHERE id = ?', [req.params.id], (err, result) => {
        if (err) {
            resp.status(500).json({
                success: false,
                message: 'Somothing went wrong'
            })
        }
        else {
            let _resp = {
                success: true,
                data: result
            }
            console.log(_resp);
            return resp.status(200).json(_resp)
        }
    })

}

exports.updatepatientHistory = (req, resp) => {
    console.log(req.body.name);
    dbConn.query('UPDATE histroy SET name =?,email = ?,result =?, date =? WHERE id = ?', [req.body.name, req.body.email, req.body.result, req.body.date, req.params.id], (err, patient) => {
        if (err) {
            resp.status(500).json({
                success: false,
                message: 'DB error',
                error: err
            })
        } else {
            resp.status(200).json({
                success: true,
                message: 'Updated Successfully',

            })
        }
    })
}


exports.getWinbyid = (req, resp) => {
    console.log(req.params.uid)

    dbConn.query('SELECT * FROM histroy WHERE uid = ? and result = "You Won"', [req.params.uid], (err, result) => {
        if (err) {
            resp.status(500).json({
                success: false,
                message: 'Somothing went wrong'
            })
        }

        if (result.length > 0) {
            let _resp = {
                success: true,
                data: result,
                result: result.length
            }
            console.log(result.length)
            console.log(_resp);
            return resp.status(200).json(_resp)

        }


    })
}
exports.getLostbyid = (req, resp) => {
    console.log(req.params.uid)


    dbConn.query('SELECT * FROM histroy WHERE uid = ? and result = "You Lost"', [req.params.uid], (err, result) => {
        if (err) {
            resp.status(500).json({
                success: false,
                message: 'Somothing went wrong'
            })
        }

        if (result.length > 0) {
            let _resp = {
                success: true,
                data: result,
                result: result.length
            }
            // result[0].result,
            console.log(result.length)
            console.log(_resp);
            return resp.status(200).json(_resp)

        }


    })
}

exports.getGametiedByid = (req, resp) => {
    console.log(req.params.uid)


    dbConn.query('SELECT * FROM histroy WHERE uid = ? and result = "Game Tied"', [req.params.uid], (err, result) => {
        if (err) {
            resp.status(500).json({
                success: false,
                message: 'Somothing went wrong'
            })
        }

        if (result.length > 0) {
            let _resp = {
                success: true,
                data: result,
                result: result.length
            }
            // result[0].result,
            console.log(result.length)
            console.log(_resp);
            return resp.status(200).json(_resp)

        }


    })
}


exports.getwinDaybyid = (req, resp) => {


    const getDays = (d) => {

        var DateArray = [];
        var days = d;
        for (var i = 0; i < days; i++) {
            if (i == 1) { i = 1; days += 1 }
            var date = new Date();
            var last = new Date(date.getTime() - (i * 24 * 60 * 60 * 1000));
            var day = last.getDate();
            var month = last.getMonth() + 1;
            var year = last.getFullYear();
            const fulld = (Number(year) + '-' + Number(month) + '-' + Number(day)) // Format date as you like
            DateArray.push(fulld);

        }
        return DateArray;
    }


    let dateArray = getDays(6)


    let winAraay = []
    let lossArray = []
    let tiedArray = []

    dateArray.map((v, i) => {

        dbConn.query('SELECT * FROM histroy WHERE uid = ? and DATE(date) = ? and result = "You Won" ', [req.params.uid, v], (err, result) => {
            if (err) {
                // console.log(err)   
            }
            else {
                // console.log(result.length) 
                winAraay.push(result.length);
            }
        })

        dbConn.query('SELECT * FROM histroy WHERE uid = ? and DATE(date) = ? and result = "You Lost" ', [req.params.uid, v], (err, result) => {
            if (err) {
                // console.log(err)   
            }
            else {
                // console.log(result.length) 
                lossArray.push(result.length);
            }
        })
        dbConn.query('SELECT * FROM histroy WHERE uid = ? and DATE(date) = ? and result = "Game Tied" ', [req.params.uid, v], (err, result) => {
            if (err) {
                // console.log(err)   
            }
            else {
                // console.log(result.length) 
                tiedArray.push(result.length);
            }
        })

    })

    setTimeout(() => {
        let _resp = { 
            success: true,
            winAraay: winAraay,
            lossArray: lossArray,
            tiedArray: tiedArray,
            dateArray: dateArray
            
        }
  
        return resp.status(200).json(_resp)
    }, 3000);


}


exports.saveScreenshort = (req, resp) =>{
    let imgdata = {
        data: req.body.path,
       
    }

        dbConn.query("INSERT INTO pdfimage SET ?", imgdata, (error, result) => {
            if(error){
                resp.status(500).json({
                    success: false,
                    message: 'Somothing went wrong'
                })
            }
            else{
               
                resp.status(200).json({
                    success: true,
                    message: 'screenshort Inserted Successfully',
                    profile_url: `http://localhost:3001/profile/${req.body.path}`
                   
                })
            }
  

})
}






