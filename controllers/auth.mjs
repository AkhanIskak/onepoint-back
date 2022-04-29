import express from "express";


const router = express.Router();

router.post("/register", async (req, res) => {
});
router.post("/resendEmailConfirmCode", async (req, res) => {
});
router.post("/confirmEmail", (req, res) => {
});
router.post("/login", (req, res) => {

});

router.post("/forgotPassword", (req, res) => {
});

router.get("/resetPassword/:email/:code", (req, res) => {
});
router.get("/", (req, res) => {
});
export default router;
