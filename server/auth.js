const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const pool = require("./db")

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secureConnection: true, 
    port: 465,
    pool: true,
    maxConnections: 20,
    tls: {
       ciphers:'SSLv3',
       rejectUnauthorized: true
    },
    auth: {
        user: 'your_email_id',
        pass: 'your_app_password'
    }
});

const signin_otp = async (req, res) => {
    email = req.body.email;

    if(email === "") return res.send("0");

    const result = await pool.query("select * from login_verification where email_id = $1", [email]);

    if(result.rowCount === 0) return res.send("1");

    otp = otpGenerator.generate(6, { specialChars: false });

    var mailOptions = {
        from: 'IIT Ropar',
        to: 'email_id_to_send_otp', 
        subject: 'Register/Sign-in', 
        text: 'Your OTP is ' 
    };

    mailOptions.to = email;
    mailOptions.text += otp;
    console.log(otp);

    // encrypt otp and save in db
    bcrypt.hash(otp, saltRounds, async function(err, hash) {
        await pool.query("UPDATE login_verification SET hashed_otp = $1, expiration_time = to_timestamp($2) WHERE email_id = $3", [hash, Date.now()/1000.0+600, email]);
    });

    // transporter.sendMail(mailOptions, function(error, info){
    //   if (error) {
    //     console.log(error);
    //   } 
    //   // else {
    //   //   console.log('Email sent: ' + info.response);
    //   // }
    // });

    return res.send("2");
}

const signin_verify = async (req, res) => {
    const {email, otp} = req.body;

    if(otp === "") return res.send("3");

    // encrypt and check for otp in db and return accordingly
    const result = await pool.query("select * from login_verification where email_id = $1", [email]);
    const result_row = result.rows[0];

    // check if otp is expired
    if(Date.now() > (new Date(result_row.expiration_time.getTime()))) {
        return res.send("2");
    }

    await bcrypt.compare(otp, result_row.hashed_otp, function(err, result) {
        if(result == true) {
            return res.send("1");
        }
        else {
            return res.send("0");
        }
    });
}

const signup_otp = async (req, res) => {
    email = req.body.email;

    if(email === "") return res.send("0");

    const result = await pool.query("select * from login_verification where email_id = $1", [email]);

    if(result.rowCount === 1) return res.send("1");

    otp = otpGenerator.generate(6, { specialChars: false });

    var mailOptions = {
        from: 'IIT Ropar',
        to: 'email_id_to_send_otp', 
        subject: 'Register/Sign-in', 
        text: 'Your OTP is ' 
    };

    mailOptions.to = email;
    mailOptions.text += otp;
    console.log(otp);

    const ifexists = await pool.query("select * from signup_verification where email_id = $1", [email]);

    // encrypt otp and save in db
    if(ifexists.rowCount === 0) {
        // First time sign-up
        bcrypt.hash(otp, saltRounds, async function(err, hash) {
            await pool.query("INSERT INTO signup_verification(email_id, hashed_otp, expiration_time) VALUES($1, $2, to_timestamp($3))", [email, hash, Date.now()/1000.0+600]);
        });
    }
    else {
        // If there is already an entry (helpful for resend OTP feature)
        bcrypt.hash(otp, saltRounds, async function(err, hash) {
            await pool.query("UPDATE signup_verification SET hashed_otp = $1, expiration_time = to_timestamp($2) WHERE email_id = $3", [hash, Date.now()/1000.0+600, email]);
        });
    }

    // transporter.sendMail(mailOptions, function(error, info){
    //   if (error) {
    //     console.log(error);
    //   } 
    //   // else {
    //   //   console.log('Email sent: ' + info.response);
    //   // }
    // });

    res.send("2");
}

const signup_verify = async (req, res) => {
    const {email, otp} = req.body;

    if(otp === "") return res.send("3");

    // encrypt and check for otp in db and return accordingly
    const result = await pool.query("select * from signup_verification where email_id = $1", [email]);
    const result_row = result.rows[0];

    // check if otp is expired
    if(Date.now() > (new Date(result_row.expiration_time.getTime()))) {
        return res.send("2");
    }

    await bcrypt.compare(otp, result_row.hashed_otp, async function(err, result) {
        if(result == true) {
            await pool.query("insert into applicants(email_id) values($1)", [email]);
            return res.send("1");
        }
        else {
            return res.send("0");
        }
    });
}

module.exports = {
    signin_otp,
    signin_verify,
    signup_otp,
    signup_verify
}