module.exports = function (db) {
 const jwt = require('jsonwebtoken')
    const bcrypt = require('bcrypt');
    const saltRounds = 10;

const verifyToken = function (req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];
    const user = req.headers['user'];
    if (!req.headers.authorization || !token) {
        res.sendStatus(401);
        return;
    }
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const { username } = decoded;
     
        if (username) {
            next();
        } else {
            res.status(403).json({
                message: 'unauthorized'
            });
        }
    } catch (err) {
        if (err && 500) {
            res.json({
                message: 'expired'
            })
        }

    }

}


const registerUser = async function (req, res) {
    try {
        const { username, password, firstName, lastName } = req.body;

        let checkDuplicate = await db.manyOrNone(`SELECT * from users WHERE username = $1`, [username]);
        bcrypt.genSalt(saltRounds, async function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {

                if (checkDuplicate.length < 1) {
                    await db.none(`insert into users (username, password, first_name, last_name) values ($1, $2, $3, $4)`, [username, hash, firstName, lastName])
                    res.json({
                        message: 'success'
                    });
                } else {
                    res.json({
                        message: 'duplicate'
                    });
                }
            });
        });
    } catch (err) {
        console.log(err);
    }
}

const loginUser = async function (req, res) {
    try {
        const { username, password } = req.body;

        const token = jwt.sign({
            username
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2m' });
        let checkUser = await db.manyOrNone(`SELECT id from users WHERE username = $1`, [username]);
        if (checkUser.length < 1) {
            res.json({
                token,
                message: 'unregistered'
            });
        } else {

            let checkPassword = await db.oneOrNone(`SELECT password from users WHERE username = $1`, [username]);

            const match = await bcrypt.compare(password, checkPassword.password);

            if (match) {
                res.json({
                    token,
                    message: 'success'
                });
            } else {
                res.json({
                    token,
                    message: 'unmatched'
                });
            }
        }
    } catch (err) {
        console.log(err);
    }

}
return {
    verifyToken,
    registerUser,
    loginUser,
  };
}