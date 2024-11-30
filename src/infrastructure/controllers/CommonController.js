import express from 'express';
import CommonResponse from '../../application/common/CommonResponse.js';
import CommonService from "../../application/services/CommonService.js";
import passport from "../../application/services/GoogleAuthService.js";

const router = express.Router();
const commonService = new CommonService();

router.get('/auth/me', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await commonService.getUserById(req.user.id)
    CommonResponse.success(res, user);
  } catch (err) {
    CommonResponse.error(res, err)
  }
});



export default router;
