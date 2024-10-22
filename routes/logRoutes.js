const logController = require("../controllers/logController");
const { requireAuth } = require("../middleware/authMiddleware");
const router = require("express").Router();

router.post("/", requireAuth, logController.createLog);
router.get("/", requireAuth, logController.getLogs);

module.exports = router;
