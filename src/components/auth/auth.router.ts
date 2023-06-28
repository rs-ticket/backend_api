require('dotenv').config();
import resetToken from "@components/user/reset_token.model";
import UserModel from "@components/user/user.model";
import consts from "@config/consts";
import { Router } from "express";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
import nodemailer from 'nodemailer';
const router: Router = Router();
import { v4 as uuidv4 } from "uuid";
import { DateTime } from "luxon";

const mailSend = (receiver: Array<string> | string, message: string, subject: string) => {
    const text = message.replace(/(<([^>]+)>)/ig, '');
    var mailOptions = {
        from: '"rs-ticket Team" <info@example.com>',
        to: `${receiver}`,
        subject: `${subject}`,
        text: `${text}`,
        html: `${message}`,
    };
    // console.log(process.env.SMTP_PORT);
    // console.log(typeof(process.env.SMTP_PORT));
    let SMTP_PORT = process.env.SMTP_PORT
    const transport = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    transport.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}



router.post('/sign-up', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let userExists = await UserModel.findOne({ email: email });
        if (userExists) {
            res.status(422).json({ message: 'User already exists' });
        }
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, (err: any, hash: any) => {
            if (err) throw new Error("Internal Server Error");
            let user = new UserModel({
                name: name,
                email: email,
                password: hash,
                role: 'technician'
            });
            user.save().then(() => {
                // create a new token
                const token = jwt.sign({
                    "id": user._id,
                    "email": user.email
                }, process.env.API_SECRET, {
                    expiresIn: 86400
                });
                res.status(200).json({ message: 'User created successfully', data: user, token: token });
            });
        })
    } catch (error: any) {
        return res.status(400).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let user = await UserModel.findOne({ email: email });
    if (!user) {
        res.status(422).json({ message: 'User does not exists' });
    }
    if (await bcrypt.compare(password, user!.password)) {
        const token = jwt.sign({
            "id": user!._id,
            "email": user!.email
        }, process.env.API_SECRET, {
            expiresIn: 86400
        });
        res.status(200).json({ message: 'login successful', data: user, token: token });
    } else {
        res.status(422).json({ message: 'Invalid Credentials', data: null, token: null });
    }
});


router.post('/forget-password', async (req, res) => {
    try {
        const {email} = req.body
        if(!email) {
            return res.status(422).json({ message: "email is required" })

        }
        // check email
        let user = await UserModel.findOne({ email: email });
        if (user) {
            let resettoken = new resetToken({ token: uuidv4(), "user_id": user._id})
            resettoken.save().then(() => {
                const link = `${process.env.BASE_URL}/password-reset/${user?._id}/${resettoken.token}`
                let mailbody = `<p>Hello ${user?.name}</p><p>Please click on this <a href="${link}">link</a></p>`
                // send reset link on mail
                mailSend(email, mailbody, `${process.env.PROJECT_NAME} reset password`)
            });
        }
        return res.status(200).json({ message: "success" })
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }

});


router.get('/password-reset/:userId/:token', async(req, res) => {
try {
    let obj = await resetToken.findOne({
        user_id: req.params.userId,
        token: req.params.token
    })
    if (!obj) {
        return res.status(consts.VALIDATION_ERROR).json({message: 'Invalid Token or expired'})
    }else{
         let dt = DateTime.fromISO(obj.createdAt)
         let now = DateTime.utc();
         let diff_mins = now.diff(dt, 'minutes')
         console.log(diff_mins)
    }
} catch (error) {
    res.send("An error occured");
    console.log(error);

}

})

export default router;