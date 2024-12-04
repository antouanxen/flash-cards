"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticateUser = void 0;
const common_1 = require("@nestjs/common");
const firebaseConfig_1 = require("./firebaseConfig");
const prisma_Client_1 = require("../prisma/prisma_Client");
let AuthenticateUser = class AuthenticateUser {
    async use(req, res, next) {
        const authHeader = req.headers.authorization;
        console.log('Request URL:', req.url, req.method);
        if (req.url.startsWith('/api')) {
            return next();
        }
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            let user = undefined;
            let decodedToken = undefined;
            let uid = undefined;
            try {
                decodedToken = await firebaseConfig_1.default.auth().verifyIdToken(token);
                uid = decodedToken.uid;
                res.locals.user = uid;
            }
            catch (err) {
                if (err) {
                    console.log('Invalid or tampered token:', err.message);
                    return res.status(401).json({ message: 'Invalid token or one that has been modified and been tampered with' });
                }
                return res.status(500).json({ message: 'Internal server error' });
            }
            try {
                const existingUser = await prisma_Client_1.default.user.findUnique({ where: { userid: uid, email: decodedToken.email } });
                const userONLYInFirebase = await firebaseConfig_1.default.auth().getUser(uid);
                if (userONLYInFirebase) {
                    if (!existingUser || existingUser.userid !== userONLYInFirebase.uid) {
                        user = await prisma_Client_1.default.user.upsert({
                            where: { email: decodedToken.email },
                            update: { userid: uid },
                            create: {
                                userid: uid,
                                email: decodedToken.email,
                                username: decodedToken.name || decodedToken.email?.split('@')[0] || 'new user'
                            }
                        });
                        console.log(`O χρήστης ενημερώθηκε ή δημιουργήθηκε με Firebase ID: ${user.userid}`);
                    }
                    else {
                        user = existingUser;
                    }
                }
                else if (!userONLYInFirebase && !existingUser) {
                    user = await prisma_Client_1.default.user.create({
                        data: {
                            userid: uid,
                            email: decodedToken.email,
                            username: decodedToken.name || decodedToken.email?.split('@')[0] || 'new user'
                        }
                    });
                    console.log(`Ενας νεος χρηστης δημιουργηθηκε με Firebase ID: ${user.userid}`);
                }
                return next();
            }
            catch (err) {
                if (err.code === 'P2002') {
                    user = await prisma_Client_1.default.user.findUnique({ where: { email: decodedToken.email } });
                    console.log('User already exists, found the existing user.');
                }
                else {
                    return res.status(500).send('Internal server error');
                }
            }
        }
        else {
            console.log('O χρηστης ειχε προβλημα με την εισοδο του στην εφαρμογη');
            return res.status(401).send('This user is not aunthenticated to continue or their credentials are wrong. Please try again.');
        }
    }
    ;
};
exports.AuthenticateUser = AuthenticateUser;
exports.AuthenticateUser = AuthenticateUser = __decorate([
    (0, common_1.Injectable)()
], AuthenticateUser);
//# sourceMappingURL=firebaseAuthentication.js.map