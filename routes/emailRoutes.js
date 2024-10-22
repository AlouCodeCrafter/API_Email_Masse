const router = require("express").Router();
const emailController = require("../controllers/emailController");
const uploads = require("../middleware/multerMiddleware");

router.post("/send", uploads.array("attachments"), emailController.sendEmail);

router.get("", emailController.getAllEmail);
module.exports = router;
