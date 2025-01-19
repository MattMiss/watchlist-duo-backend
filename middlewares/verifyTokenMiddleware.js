import { admin } from "../config/firebase.js";

const verifyTokenMiddleware = async (req, res, next) => {
    //console.log(req);

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).send("Unauthorized");
    }
  
    const idToken = authHeader.split(" ")[1];
  
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken; // Add the decoded user info to the request object
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(403).send("Forbidden");
    }
};

export default verifyTokenMiddleware;