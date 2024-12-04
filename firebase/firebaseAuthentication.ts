import { Injectable, NestMiddleware } from "@nestjs/common";
import firebase from "./firebaseConfig";
import { NextFunction, Request, Response } from "express";
import prisma from '../prisma/prisma_Client'


@Injectable()
export class AuthenticateUser implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        const authHeader = req.headers.authorization
        console.log('Request URL:', req.url, req.method);
       
        if (req.url.startsWith('/api')) {
           return next()
        }

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided'})
        }
        const token = authHeader.split('Bearer ')[1]
        
        if (token) {
            let user = undefined
            let decodedToken = undefined
            let uid = undefined

            try {
                decodedToken = await firebase.auth().verifyIdToken(token)

                uid = decodedToken.uid
                res.locals.user = uid
            } catch(err: any) {
                if (err) {
                    console.log('Invalid or tampered token:', err.message)
                    return res.status(401).json({ message: 'Invalid token or one that has been modified and been tampered with'})
                }
                return res.status(500).json({ message: 'Internal server error'})
            }
 
            try {
                const existingUser = await prisma.user.findUnique({ where: { userid: uid, email: decodedToken.email } })
                const userONLYInFirebase = await firebase.auth().getUser(uid)

                if (userONLYInFirebase) {
                    if (!existingUser || existingUser.userid !== userONLYInFirebase.uid) {
                        user = await prisma.user.upsert({
                            where: { email: decodedToken.email },
                            update: { userid: uid },
                            create: {
                                userid: uid,
                                email: decodedToken.email,
                                username: decodedToken.name || decodedToken.email?.split('@')[0] || 'new user'
                            } 
                        })
                        console.log(`O χρήστης ενημερώθηκε ή δημιουργήθηκε με Firebase ID: ${user.userid}`);
                    } else {
                        user = existingUser
                    }
                } else if (!userONLYInFirebase && !existingUser) {
                    user = await prisma.user.create({
                        data: {
                            userid: uid,
                            email: decodedToken.email,
                            username: decodedToken.name || decodedToken.email?.split('@')[0] || 'new user'
                        } 
                    })
                    console.log(`Ενας νεος χρηστης δημιουργηθηκε με Firebase ID: ${user.userid}`);
                }

                return next()
            } catch(err: any) { 
                if (err.code === 'P2002') {  
                    user = await prisma.user.findUnique({ where: { email: decodedToken.email } });
                    console.log('User already exists, found the existing user.');
                } else {
                    return res.status(500).send('Internal server error');
                }
            }
        } else {
            console.log('O χρηστης ειχε προβλημα με την εισοδο του στην εφαρμογη');
            return res.status(401).send('This user is not aunthenticated to continue or their credentials are wrong. Please try again.')
        }
    };
}
