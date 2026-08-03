const jwt = require("jsonwebtoken");
async function authAdmin(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            message:"unauthorized"
        })
    }
    try
    {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        if(decoded.role !== 'admin'){
            return res.status(403).json({
                message:"forbidden"
            })
        }

        req.user = decoded;
        next();

    } 
    catch(err){
        console.log(err);
        res.status(401).json({
            message:"unauthorized"
        })
    }
}

async function authCustomer(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({
            message:"unauthorized"
        })
    }
    try
    {
        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        if(decoded.role !== 'customer' && decoded.role !== 'admin'){
            return res.status(403).json({
                message:"forbidden"
            })
        }

        req.user = decoded;
        next();

    } 
    catch(err){
        console.log(err);
        res.status(401).json({
            message:"unauthorized"
        })
    }
}

module.exports = {authAdmin,authCustomer}